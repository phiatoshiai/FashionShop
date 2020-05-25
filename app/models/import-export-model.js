'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var importExportProductSchema = new Schema({
  product: Schema.Types.ObjectId,
  type: {
    type: String,
    enum: [
      '2c5a6627-2451-4ae6-86fa-05f9c567a6b3', // import
      '3c9472a8-cd85-46fa-8036-64ec4b0b1405', // export
    ],
  },
  pcs: { type: Number, default: 0},
  reason: { type: String },
  price: {type: Number},
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('import-export-product', importExportProductSchema);
