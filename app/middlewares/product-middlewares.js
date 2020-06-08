'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { isSpecialWord } = require('../../util/validation');
const Promise = require('bluebird');

async function validateInputDataProduct(req, res, next) {
  try {
    const { name, code, _id } = req.body;
    await validateName(name, _id);
    await validateCode(code, _id);
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateName(name, _id) {
  name = name.trim();
  if (isEmpty(name)) {
    return Promise.reject(new Error('Xin vui lòng nhập tên sản phẩm'));
  } else {
    //Tên không có kí tự đặt biệt
    if (!isSpecialWord(name)) {
      return Promise.reject(
        new Error('Tên sản phẩm không được chứa kí tự đặt biệt')
      );
    }

    //Tên trùng lặp
    const query = {
      $and: [{ deleted: false, activated: true, slug: slugifyString(name) }],
    };
    if (!isEmpty(_id)) {
      query['$and'].push({ _id: _id });
    }
    const productDB = await ProductModel.find(query);
    if (!isEmpty(productDB) && isEmpty(_id)) {
      return Promise.reject(
        new Error('Tên sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }

    if (!isEmpty(productDB) && !isEmpty(_id) && productDB.length > 1) {
      return Promise.reject(
        new Error('Tên sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }
  }
} //validate product name

async function validateCode(code, _id) {
  code = code.trim();
  if (isEmpty(code)) {
    return Promise.reject(new Error('Xin vui lòng nhập mã code sản phẩm'));
  } else {
    //Code không có kí tự đặt biệt
    if (!isSpecialWord(code, 'code')) {
      return Promise.reject(
        new Error('Mã code không được chứa kí tự đặt biệt')
      );
    }

    //Code: IN HOA,số ,_, -
    const regx = constants.REGEX_PRODUCT_CODE;
    if (!regx.test(code)) {
      return Promise.reject(new Error('Mã code không hợp lệ'));
    }

    //Code trùng lặp
    const query = {
      $and: [{ deleted: false, activated: true, code: code }],
    };
    if (!isEmpty(_id)) {
      query['$and'].push({ _id: _id });
    }
    const productDB = await ProductModel.find(query);
    if (!isEmpty(productDB) && isEmpty(_id)) {
      return Promise.reject(
        new Error('Mã code sản phẩm trùng lặp, xin vui lòng nhập mã khác')
      );
    }

    if (!isEmpty(productDB) && !isEmpty(_id) && productDB.length > 1) {
      return Promise.reject(
        new Error('Mã code sản phẩm trùng lặp, xin vui lòng nhập mã khác')
      );
    }
  }
} //validate product code

module.exports = {
  validateInputData: validateInputDataProduct,
};
