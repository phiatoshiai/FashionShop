'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
  name: { type: String },
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
const CategoryModel = mongoose.model('CategoryModel', categorySchema, 'categories');
module.exports = CategoryModel;
