'use strict';
const { isEmpty } = require('lodash');
const WarehouseModel = require('../models/warehouse-model');
const constants = require('../../util/constants');
const { isNumberField } = require('../../util/validation');
const Promise = require('bluebird');

async function validateInputDataImportExport(req, res, next) {
  try {
    const { type, warehouse } = req.body;
    await validateType(type);
    await validateWarehouse(warehouse);
    await validateIsNumber(req.body);
    next();
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
} //validate input data

async function validateType(type) {
  if (
    type === constants.TYPE.IMPORT_EXPORT.IMPORT ||
    type === constants.TYPE.IMPORT_EXPORT.EXPORT
  ) {
    return true;
  } else {
    return Promise.reject(new Error('Kiểu Nhập/Xuất không hợp lệ'));
  }
} //validate type

async function validateWarehouse(warehouse) {
  if (isEmpty(warehouse)) {
    return Promise.reject(new Error('Xin vui lòng kho sản phẩm'));
  }

  const wareHouseDB = await WarehouseModel.findOne({ _id: warehouse });
  if (isEmpty(wareHouseDB)) {
    return Promise.reject(
      new Error('Không tồn tại kho sản phẩm này trong cơ sở dữ liệu')
    );
  }
} //validate ware house

async function validateIsNumber(body) {
  const { qty } = body;

  if (isEmpty(qty) && isNumberField(qty) === -1) {
    return Promise.reject(new Error('Xin vui lòng nhập số lượng sản phẩm'));
  }

  if (isNumberField(qty) === -1) {
    return Promise.reject(new Error('Xin vui lòng nhập giá trị là số nguyên dương '));
  }
} //validate isNumber

module.exports = {
  validateInputData: validateInputDataImportExport,
};
