'use strict';
const { isEmpty } = require('lodash');
const WarehouseModel = require('../models/warehouse-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { getAudit, processTimeAndAudit } = require('../../util/audit');


  //create Warehouse
  async function createWarehouse (req, res) {
    try {
      req.body = processTimeAndAudit(req, req.body, 'create');
      WarehouseModel.create(req.body, (err, data) => {
        if (err) {
          return res
            .status(500)
            .send({ msg: 'Xảy ra lỗi trong quá trình tạo mới kho sản phẩm' });
        }

        return res.status(201).json(data);
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  //getById
  async function getWarehouseById (req, res) {
    try {
      const id = req.params.id;
      const wareHouseById = await WarehouseModel.findOne({ _id: id });
      if (!isEmpty(wareHouseById)) {
        return res.status(200).json(wareHouseById);
      } else {
        return res.status(200).json({ _id: 123 });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  //update
  async function updateWarehouse (req, res) {
    try {
      req.body = processTimeAndAudit(req, req.body, 'update');
      await WarehouseModel.update(req.body, (err) => {
        if (!isEmpty(err)) {
          return res.status(500).json({ msg: err.message });
        }
      });

      const wareHouseDB = await WarehouseModel.findOne({ _id: req.body._id });
      if (!isEmpty(wareHouseDB)) {
        return res.status(200).json(wareHouseDB);
      }
      return res.status(200).json({ _id: 123 });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  //list by query
  async function getAllWarehouse (req, res) {
    try {
      const query = {
        $and: [{ deleted: false, activated: true }],
      };

      const params = req.query;
      const { q } = params;
      const perPage = parseInt(params.perPage) || constants.LIMIT_DEFAULT;
      const page = parseInt(params.page) || 1;
      if (!isEmpty(q)) {
        let subQuerySearch = { $or: [] };
        subQuerySearch['$or'].push({
          slug: { $regex: slugifyString(q), $options: 'i' },
        });
        query['$and'].push(subQuerySearch);
      }

      const listWarehouse = await WarehouseModel.find(query)
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });

      return res.status(200).json(listWarehouse);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }

  module.exports = {
    createWarehouse: createWarehouse,
    getWarehouseById: getWarehouseById,
    updateWarehouse: updateWarehouse,
    getAllWarehouse: getAllWarehouse,
  };

