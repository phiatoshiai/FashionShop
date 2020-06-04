'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const constants = require('../../util/constants');
const slugify = require('slugify');
const Promise = require('bluebird');

async function validateInputData(req, res, next) {
  try {
    const { name, code } = req.body;
    await validateName(name);
    await validateCode(code);
    return next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateName(name) {
  if (isEmpty(name)) {
    return Promise.reject(new Error('Xin vui lòng nhập tên sản phẩm'));
  } else {
    name = name.trim();
    if (isEmpty(name)) {
      return Promise.reject(new Error('Xin vui lòng nhập tên sản phẩm'));
    }

    //Tên không có kí tự đặt biệt
    const regx = constants.REGEX_PRODUCT_NAME;
    const slug = slugify(name, { lower: true });
    if (!regx.test(slug)) {
      return Promise.reject(new Error('Tên sản phẩm không hợp lệ'));
    }

    //Tên trùng lặp
    const productDB = await ProductModel.findOne({ slug: slug });
    if (!isEmpty(productDB)) {
      return Promise.reject(
        new Error('Tên sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }
  }
} //validate product name

async function validateCode(code) {
  if (isEmpty(code)) {
    return Promise.reject(new Error('Xin vui lòng nhập mã code sản phẩm'));
  } else {
    code = code.trim();
    if (isEmpty(code)) {
      return Promise.reject(new Error('Xin vui lòng nhập mã code sản phẩm'));
    }

    //Code: IN HOA,số ,_, -
    const regx = constants.REGEX_PRODUCT_CODE;
    if (!regx.test(code)) {
      return Promise.reject(new Error('Mã code không hợp lệ'));
    }

    //Code trùng lặp
    const productDB = await ProductModel.findOne({ code: code });
    if (!isEmpty(productDB)) {
      return Promise.reject(
        new Error('Mã code sản phẩm trùng lặp, xin vui lòng nhập mã khác')
      );
    }
  }
} //validate product code

module.exports = {
  validateInputData: validateInputData,
};
