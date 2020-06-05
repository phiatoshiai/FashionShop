'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const slugify = require('slugify');
const constants = require('../../util/constants');
const moment = require('moment');
require('moment-timezone');

module.exports = {
  //create Product
  createProduct: async (req, res) => {
    const { name, color, material, origin } = req.body;
    const { pictureUrl, description } = req.body;
    let newProduct = new ProductModel();
    newProduct.name = name;
    newProduct.color = color || null;
    newProduct.material = material || null;
    newProduct.origin = origin || null;
    newProduct.pictureUrl = pictureUrl || [
      'https://sovaco.vn/image/empty_cart.jpg',
    ];
    newProduct.description = description || 'Là con gái phải xinh - PT Store';
    newProduct.slug = slugify(name, { lower: true });

    newProduct.save(async (err, data) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: 'Xảy ra lỗi trong quá trình tạo mới sản phẩm' });
      }

      return res.status(200).json(data);
    });
  },

  //getById
  getProductById: async (req, res) => {
    try {
      const id = req.params.id;
      const productById = await ProductModel.findOne({ _id: id });
      if (!isEmpty(productById)) {
        return res.status(200).json({ productById });
      } else {
        return res.status(200).json({ _id: 123 });
      }
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  //update
  updateProduct: async (req, res) => {
    try {
      req.body.updatedAt = moment()
        .tz(constants.TIMEZONE_DEFAULT)
        .utc()
        .toDate();
      await ProductModel.update(req.body, (err) => {
        if (!isEmpty(err)) {
          return res.status(500).json({ msg: err.message });
        }
      });

      const ProductDB = await ProductModel.findOne({ _id: req.body._id });
      if (!isEmpty(ProductDB)) {
        return res.status(200).json({ ProductDB });
      }
      return res.status(200).json({ _id: 123 });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
