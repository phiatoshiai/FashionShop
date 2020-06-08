'use strict';
const { isEmpty } = require('lodash');
const CategoryModel = require('../models/category-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { processTimeAndAudit } = require('../../util/audit');

//create Category
async function createCategory(req, res) {
  try {
    req.body = processTimeAndAudit(req, req.body, 'create');
    await checkTypeInDB(type, category);
    CategoryModel.create(req.body, (err, data) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: 'Xảy ra lỗi trong quá trình tạo mới sản phẩm' });
      }

      return res.status(201).json(data);
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}
//getById
async function getCategoryById(req, res) {
  try {
    const id = req.params.id;
    const categoryById = await CategoryModel.findOne({ _id: id });
    if (!isEmpty(categoryById)) {
      return res.status(200).json(categoryById);
    } else {
      return res.status(200).json({ _id: 123 });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//update
async function updateCategory(req, res) {
  try {
    req.body = processTimeAndAudit(req, req.body, 'update');
    await CategoryModel.update(req.body, (err) => {
      if (!isEmpty(err)) {
        return res.status(500).json({ msg: err.message });
      }
    });

    const categoryDB = await CategoryModel.findOne({ _id: req.body._id });
    if (!isEmpty(categoryDB)) {
      return res.status(200).json(categoryDB);
    }
    return res.status(200).json({ _id: 123 });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//list category by query
async function getAllCategory(req, res) {
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

    const listCategory = await CategoryModel.find(query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalCategory = await CategoryModel.count(query);

    return res.status(200).json({ data: listCategory, total: totalCategory });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

module.exports = {
  createCategory: createCategory,
  getCategoryById: getCategoryById,
  updateCategory: updateCategory,
  getAllCategory: getAllCategory,
};
