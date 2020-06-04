'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const constants = require('../../util/constants');
const slugify = require('slugify');

async function validateInputData(req, res) {
  const { name, code } = req.body;
  await validateName(name, res);
  await validateCode(code, res);
} //validate input data

async function validateName(name, res) {
  if (isEmpty(name)) {
    return res.status(400).send({ msg: 'Xin vui lòng nhập tên sản phẩm' });
  } else {
    name = name.trim();
    if (isEmpty(name)) {
      return res.status(400).send({ msg: 'Xin vui lòng nhập tên sản phẩm' });
    }

    //Tên không có kí tự đặt biệt
    const regx = constants.REGEX_PRODUCT_NAME;
    const slug = slugify(name, { lower: true });
    if (!regx.test(slug)) {
      return res.status(400).send({ msg: 'Tên sản phẩm không hợp lệ' });
    }

    //Tên trùng lặp
    const productDB = await ProductModel.findOne({ slug: slug });
    if (!isEmpty(productDB)) {
      return res
        .status(400)
        .send({ msg: 'Tên sản phẩm trùng lặp, xin vui lòng nhập tên khác' });
    }
  }
} //validate product name

async function validateCode(code, res) {
  if (isEmpty(code)) {
    return res.status(400).send({ msg: 'Xin vui lòng nhập mã code sản phẩm' });
  } else {
    code = code.trim();
    if (isEmpty(code)) {
      return res
        .status(400)
        .send({ msg: 'Xin vui lòng nhập mã code sản phẩm' });
    }

    //Code: IN HOA,số ,_, -
    const regx = constants.REGEX_PRODUCT_CODE;
    if (!regx.test(code)) {
      return res.status(400).send({ msg: 'Mã code không hợp lệ' });
    }

    //Code trùng lặp
    const productDB = await ProductModel.findOne({ code: code });
    if (!isEmpty(productDB)) {
      return res
        .status(400)
        .send({ msg: 'Mã code sản phẩm trùng lặp, xin vui lòng nhập mã khác' });
    }
  }
} //validate product code

module.exports = {
  validateInputData: validateInputData,
};
