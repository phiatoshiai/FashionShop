'use strict';
const { isEmpty } = require('lodash');
const BestTopConfigModel = require('../models/best-top-config-model');
const CategoryModel = require('../models/category-model');
const { slugifyString } = require('../../util/slugifyString');
const { isSpecialWord, isNumberField } = require('../../util/validation');
const constants = require('../../util/constants');
const Promise = require('bluebird');

async function validateInputDataBestTopConfig(req, res, next) {
  try {
    const { _id, name, type, category } = req.body;
    await validateName(name, _id);
    await validateType(type);
    await validateCategory(type, category);
    await validateIsNumber(req.body);
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateName(name, _id) {
  name = name.trim();
  if (isEmpty(name)) {
    return Promise.reject(new Error('Xin vui lòng nhập tên bộ cài đặt'));
  } else {
    //Tên không có kí tự đặt biệt
    if (!isSpecialWord(name)) {
      return Promise.reject(
        new Error('Tên bộ cài đặt không được chứa kí tự đặt biệt')
      );
    }

    //Tên trùng lặp
    const query = {
      $and: [{ deleted: false, activated: true, slug: slugifyString(name) }],
    };
    if (!isEmpty(_id)) {
      query['$and'].push({ _id: _id });
    }
    const besTopConfigDB = await BestTopConfigModel.find(query);
    if (!isEmpty(besTopConfigDB) && isEmpty(_id)) {
      return Promise.reject(
        new Error('Tên bộ cài đặt trùng lặp, xin vui lòng nhập tên khác')
      );
    }

    if (
      !isEmpty(besTopConfigDB) &&
      !isEmpty(_id) &&
      besTopConfigDB.length > 1
    ) {
      return Promise.reject(
        new Error('Tên bộ cài đặt trùng lặp, xin vui lòng nhập tên khác')
      );
    }
  }
} //validate name

async function validateType(type) {
  if (
    type === constants.TYPE.BEST_TOP_CONFIG.CATEGORY ||
    type === constants.TYPE.BEST_TOP_CONFIG.ALL
  ) {
    return true;
  } else {
    return Promise.reject(new Error('Kiểu bộ cài đặt không hợp lệ'));
  }
} //validate type

async function validateCategory(type, category) {
  if (!isEmpty(type) && type === constants.TYPE.BEST_TOP_CONFIG.CATEGORY) {
    if (isEmpty(category)) {
      return Promise.reject(
        new Error('Xin vui lòng lựa chọn danh mục áp dụng')
      );
    } else {
      const categoryDB = await CategoryModel.findOne({ _id: category });
      if (isEmpty(categoryDB)) {
        return Promise.reject(new Error('danh mục áp dụng không tồn tại'));
      }
    }
  }
} //validate category

async function validateIsNumber(body) {
  const { limit } = body;

  if (!isEmpty(limit) && isNumberField(limit) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }
} //validate isNumber

module.exports = {
  validateInputData: validateInputDataBestTopConfig,
};
