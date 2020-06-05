'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const moment = require('moment');
require('moment-timezone');

module.exports = {
  //create Product
  createProduct: async (req, res) => {
    const { name, color, material, origin } = req.body;
    const { pictureUrl, description } = req.body;
    let newProduct = new ProductModel();
    newProduct.name = name;
    newProduct.code = code;
    newProduct.color = color || null;
    newProduct.material = material || null;
    newProduct.origin = origin || null;
    newProduct.pictureUrl = pictureUrl || [
      'https://sovaco.vn/image/empty_cart.jpg',
    ];
    newProduct.description = description || 'Là con gái phải xinh - PT Store';
    newProduct.slug = slugifyString(name);

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

  //list product by query
  getAllProduct: async (req, res) => {
    try {
      const query = {
        $and: [{ deleted: false, activated: true }],
      };

      const params = req.query;
      const { q, color, material, origin } = params;
      const perPage = parseInt(params.perPage) || constants.LIMIT_DEFAULT;
      const page = parseInt(params.page) || 1;
      if (!isEmpty(q)) {
        let subQuerySearch = { $or: [] };
        subQuerySearch['$or'].push({
          slug: { $regex: slugifyString(q), $options: 'i' },
        });
        subQuerySearch['$or'].push({
          code: { $regex: q, $options: 'i' },
        });

        query['$and'].push(subQuerySearch);
      }

      if (!isEmpty(color)) {
        query['$and'].push({ color: color });
      }

      if (!isEmpty(material)) {
        query['$and'].push({ material: material });
      }

      if (!isEmpty(origin)) {
        query['$and'].push({ origin: origin });
      }

      console.log('aaaaaaa', query);

      const listProduct = await ProductModel.find(query)
        .skip(perPage * page - perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });

      return res.status(200).json(listProduct);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
