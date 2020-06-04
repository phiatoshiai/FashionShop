'use strict';
const { isEmpty } = require('lodash');
const ProductModel = require('../models/product-model');
const slugify = require('slugify');

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
};
