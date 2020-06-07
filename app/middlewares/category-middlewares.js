'use strict';
const { isEmpty } = require('lodash');
const CategoryModel = require('../models/category-model');
const { slugifyString } = require('../../util/slugifyString');
const Promise = require('bluebird');

async function validateInputDataCategory(req, res, next) {
  try {
    const { name, _id } = req.body;
    await validateName(name, _id);
    return next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateName(name, _id) {
  name = name.trim();
  if (isEmpty(name)) {
    return Promise.reject(new Error('Xin vui lòng nhập tên danh mục'));
  } else {
    //Tên không có kí tự đặt biệt
    if (!findSpecialWord(name)) {
      return Promise.reject(
        new Error('Tên danh mục không được chứa kí tự đặt biệt')
      );
    }

    //Tên trùng lặp
    let query = {
      $and: [
        { activated: true },
        { deleted: false },
        { slug: slugifyString(name) },
      ],
    };

    if (!isEmpty(_id)) {
      query['$and'].push({ _id: _id });
    }

    const catagoryDB = await CategoryModel.find(query);
    if (!isEmpty(catagoryDB) && isEmpty(_id)) {
      return Promise.reject(
        new Error('Tên danh mục trùng lặp, xin vui lòng nhập tên khác')
      );
    }

    if (!isEmpty(catagoryDB) && !isEmpty(_id) && catagoryDB.length > 1) {
      return Promise.reject(
        new Error('Tên sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }
  }
} //validate category name

module.exports = {
  validateInputData: validateInputDataCategory,
};
