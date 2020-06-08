'use strict';
const { isEmpty, get } = require('lodash');
const WarehouseModel = require('../models/warehouse-model');
const ImportExportModel = require('../models/import-export-model');
const ImportExportHistoryModel = require('../models/import-export-history-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { getAudit, processTimeAndAudit } = require('../../util/audit');

//create import/export
async function createImportExport(req, res) {
  try {
    req.body = processTimeAndAudit(req, req.body, 'create');
    await updateWarehouse(req, req.body);
    ImportExportModel.create(req.body, async (err, data) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: 'Xảy ra lỗi trong quá trình tạo mới nhập/xuất' });
      }
      await createHistory(data);
      return res.status(201).json(data);
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//getById
async function getImportExportById(req, res) {
  try {
    const id = req.params.id;
    const importExportById = await ImportExportModel.findOne({ _id: id });
    if (!isEmpty(importExportById)) {
      return res.status(200).json(importExportById);
    } else {
      return res.status(200).json({ _id: 123 });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//update
async function updateImportExport(req, res) {
  try {
    const { warehouse, _id } = req.body;
    req.body = processTimeAndAudit(req, req.body, 'update');
    let wareHouseDB = await WarehouseModel.findOne({ _id: warehouse });
    if (isEmpty(wareHouseDB)) {
      throw new Error('Không tồn kho sản phẩm trong cơ sở dữ liệu');
    }
    wareHouseDB = wareHouseDB.toJSON();

    const importExportDB = await ImportExportModel.findOne({ _id: _id });
    if (isEmpty(importExportDB)) {
      throw new Error('Không tồn tại lệnh nhập xuất trong cơ sở dữ liệu');
    } else {
      const qtyUI = get(req.body, 'qty') || 0;
      const qtyDB = importExportDB.qty;
      const type = req.body.type;
      if (qtyUI !== qtyDB) {
        switch (type) {
          case constants.TYPE.IMPORT_EXPORT.IMPORT:
            wareHouseDB.qty = wareHouseDB.qty - qtyDB + qtyUI;
            break;
          case constants.TYPE.IMPORT_EXPORT.EXPORT:
            wareHouseDB.qty = wareHouseDB.qty - qtyDB - qtyUI;
            if (wareHouseDB.qty < 0) {
              throw new Error(
                'Số lượng sản phẩm trong kho ít hơn số lượng sản phẩm cần xuất ra'
              );
            }
            break;
          default:
            throw new Error('Không tồn tại type');
        }
      }
    }
    await WarehouseModel.update(wareHouseDB, (err) => {
      if (err) {
        throw new Error('Xảy ra lỗi trong quá trình cập nhật kho hàng');
      }
    });

    await ImportExportModel.update(req.body, (err) => {
      if (!isEmpty(err)) {
        return res.status(500).json({ msg: err.message });
      }
    });

    const importExportDBRes = await ImportExportModel.findOne({
      _id: req.body._id,
    });
    if (!isEmpty(importExportDBRes)) {
      let history = importExportDBRes.toJSON();
      delete history._id;
      history.reason = 'update: chỉnh sửa số lượng hàng nhập/xuất';
      await ImportExportHistoryModel.create(history, (err) => {
        if (err) {
          throw new Error('Xảy ra lỗi trong quá trình tạo lịch sử nhập xuất');
        }
      });
      return res.status(200).json(importExportDBRes);
    }
    return res.status(200).json({ _id: 123 });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//list by query
async function getAllImportExport(req, res) {
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
        reason: { $regex: slugifyString(q), $options: 'i' },
      });
      query['$and'].push(subQuerySearch);
    }

    const listImportExport = await ImportExportModel.find(query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    const totalImportExport = await ImportExportHistoryModel.count(query);

    return res
      .status(200)
      .json({ data: listImportExport, total: totalImportExport });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

/**
 * FUNCTION
 */
//get qty
async function getQty(type, qty, wareHouseDB) {
  try {
    switch (type) {
      case constants.TYPE.IMPORT_EXPORT.IMPORT:
        wareHouseDB.qty = wareHouseDB.qty + qty;
        return wareHouseDB.qty;
      case constants.TYPE.IMPORT_EXPORT.EXPORT:
        wareHouseDB.qty = wareHouseDB.qty - qty;
        if (wareHouseDB.qty < 0) {
          throw new Error(
            'Số lượng sản phẩm trong kho ít hơn số lượng sản phẩm cần xuất ra'
          );
        }
        return wareHouseDB.qty;
      default:
        throw new Error('Không tồn tại kiểu nhập/xuất');
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

//update ware-house
async function updateWarehouse(req, body) {
  try {
    const { type, qty, warehouse } = body;
    const { now, updatedBy } = getAudit(req);
    let wareHouseDB = await WarehouseModel.findOne({ _id: warehouse });
    if (isEmpty(wareHouseDB)) {
      throw new Error('Không tồn tại kho hàng này trong cơ sở dữ liệu');
    }
    wareHouseDB = wareHouseDB.toJSON();
    wareHouseDB.qty = await getQty(type, qty, wareHouseDB);
    wareHouseDB.updatedAt = now;
    wareHouseDB.updatedBy = updatedBy;
    console.log('updateWarehouse -> wareHouseDB', wareHouseDB);
    await WarehouseModel.update(wareHouseDB, (err) => {
      if (err) {
        throw new Error('Xảy ra lỗi trong quá trình cập nhật kho hàng');
      }
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

//create history
async function createHistory(data) {
  try {
    let history = data.toJSON();
    history.reason = 'tạo lệnh nhập xuất';
    await ImportExportHistoryModel.create(history, (err) => {
      if (err) {
        throw new Error('Xảy ra lỗi trong quá trình tạo lịch sử nhập xuất');
      }
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  createImportExport: createImportExport,
  getImportExportById: getImportExportById,
  updateImportExport: updateImportExport,
  getAllImportExport: getAllImportExport,
};
