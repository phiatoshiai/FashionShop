'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bestTopSchema = new Schema({
  name: { type: String },
  limit: { type: Number, default: 5 },
  type: {
    type: String,
    enum: [
      'cb7d9544-41b3-4888-803d-ff88894b905a', // category
      '1760dc79-fcbd-46ea-954e-f9b7c7a05da1', // all product
    ],
  },
  category: { type: Schema.Types.ObjectId, ref: 'CategoryModel' },
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

module.exports = mongoose.model('BestTopConfigModel', bestTopSchema, 'best-top-config');
