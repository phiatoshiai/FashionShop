'use strict';
const { isEmpty } = require('lodash');
const WarehouseModel = require('../models/warehouse-model');
const ProductModel = require('../models/product-model');
const { slugifyString } = require('../../util/slugifyString');
const { isSpecialWord, isNumberField } = require('../../util/validation');
const Promise = require('bluebird');

async function validateInputDataWareHouse(req, res, next) {
  try {
    const { _id, name, product } = req.body;
    await validateName(name, _id);
    await validateProduct(product);
    await validateIsNumber(req.body);
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateName(name, _id) {
  name = name.trim();
  if (isEmpty(name)) {
    return Promise.reject(new Error('Xin vui lòng nhập tên kho sản phẩm'));
  } else {
    //Tên không có kí tự đặt biệt
    if (!isSpecialWord(name)) {
      return Promise.reject(
        new Error('Tên kho sản phẩm không được chứa kí tự đặt biệt')
      );
    }

    //Tên trùng lặp
    const query = {
      $and: [{ deleted: false, activated: true, slug: slugifyString(name) }],
    };
    if (!isEmpty(_id)) {
      query['$and'].push({ _id: _id });
    }
    const wareHouseDB = await WarehouseModel.find(query);
    if (!isEmpty(wareHouseDB) && isEmpty(_id)) {
      return Promise.reject(
        new Error('Tên kho sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }

    if (!isEmpty(wareHouseDB) && !isEmpty(_id) && wareHouseDB.length > 1) {
      return Promise.reject(
        new Error('Tên kho sản phẩm trùng lặp, xin vui lòng nhập tên khác')
      );
    }
  }
} //validate ware house name

async function validateProduct(product) {
  if (isEmpty(product)) {
    return Promise.reject(new Error('Xin vui lòng chọn sản phẩm'));
  }

  const productDB = ProductModel.findOne({ _id: product });
  if (isEmpty(productDB)) {
    return Promise.reject(
      new Error('Không tồn tại sản phẩm này trong cơ sở dữ liệu')
    );
  }
} //validate ware house product

async function validateIsNumber(body) {
  const { selled, rest, discount, price, qty } = body;
  if (isEmpty(price) && isNumberField(price) === -1) {
    return Promise.reject(new Error('Xin vui lòng nhập giá sản phẩm'));
  }

  if (isNumberField(price) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }

  if (!isEmpty(selled) && isNumberField(selled) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }

  if (!isEmpty(rest) && isNumberField(rest) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }

  if (!isEmpty(discount) && isNumberField(discount) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }

  if (!isEmpty(qty) && isNumberField(qty) === -1) {
    return Promise.reject(
      new Error('Xin vui lòng nhập giá trị là số nguyên dương')
    );
  }
} //validate isNumber

module.exports = {
  validateInputData: validateInputDataWareHouse,
};
