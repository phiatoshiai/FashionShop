var cloudinary = require('cloudinary').v2;
const keys = require('../../util/keys');
const fs = require('fs');

cloudinary.config({
  cloud_name: keys.CLOUDINARY.CLOUD_NAME,
  api_key: keys.CLOUDINARY.KEY,
  api_secret: keys.CLOUDINARY.SECRET
});

var self = (module.exports = {
  uploadSingle: file => {
    return new Promise(resolve => {
      cloudinary.uploader
        .upload(file, {
          folder: 'single'
        })
        .then(result => {
          if (result) {
            fs.unlinkSync(file);
            resolve({
              url: result.secure_url
            });
          }
        });
    });
  },
  
  uploadMultiple: file => {
    return new Promise(resolve => {
      cloudinary.uploader
        .upload(file, {
          folder: 'product'
        })
        .then(result => {
          if (result) {
            fs.unlinkSync(file);
            resolve({
              url: result.secure_url,
              id: result.public_id,
              thumb1: self.reSizeImage(result.public_id, 200, 200),
              main: self.reSizeImage(result.public_id, 500, 500),
              thumb2: self.reSizeImage(result.public_id, 300, 300)
            });
          }
        });
    });
  },
  reSizeImage: (id, h, w) => {
    return cloudinary.url(id, {
      height: h,
      width: w,
      crop: 'scale',
      format: 'jpg'
    });
  }
});
