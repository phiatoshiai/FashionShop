'use strict';
const ControllerUpload = require('../app/controllers/upload-image-controller');
const uploadMulter = require('../app/models/ModelMulter');

module.exports = function(app) {
  app
    .route('/uploadSingle')
    .post(uploadMulter.single('name'), ControllerUpload.uploadSingleFile);

  app
    .route('/uploadMultiple')
    .post(uploadMulter.any(), ControllerUpload.uploadMultipleFiles);
};
