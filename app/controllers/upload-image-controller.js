'use strict';
const cloudinary = require('../models/ModelCloudinary');
const lodash = require('lodash');
module.exports = {
  //Upload single file
  uploadSingleFile: async (req, res) => {
    const data = await cloudinary.uploadSingle(req.file.path).then(result => {
      return {
        name: req.file.originalname || '',
        url: result.url
      };;
    });
    res.json(data);
  },

  //Upload multiple files
  uploadMultipleFiles: async (req, res) => {
    let data = await Promise.all(
      lodash.map(req.files, async file => {
        const result = await cloudinary.uploadMultiple(file.path);
        return result;
      })
    );

    data = lodash.map(data, (value, index) => {
      return {
        name: req.files[index].originalname,
        url: value.url
      };
    });
    res.json(data);
  }
};
