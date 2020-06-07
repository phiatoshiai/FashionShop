'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: { type: String },
  color: { type: String },
  material: { type: String },
  code: { type: String },
  origin: { type: String },
  pictureUrl: [{ type: String }],
  description: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'categories' },
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  slug: { type: String },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const ProductModel = mongoose.model('products', productSchema);
module.exports = ProductModel;
