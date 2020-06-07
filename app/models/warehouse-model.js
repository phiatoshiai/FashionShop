'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wareHouseSchema = new Schema({
  name: { type: String },
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  pcs: { type: Number, default: 0},
  selled: { type: Number, default: 0},
  rest: { type: Number, default: 0},
  discount: { type: Number, default: 0 },
  price: { type: Number },
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

module.exports = mongoose.model('ware-house', wareHouseSchema);
