'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billHistorySchema = new Schema({
  bill: { type: Schema.Types.ObjectId, ref: 'bills' },
  customer: { type: Schema.Types.ObjectId, ref: 'users' },
  products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
  status: { type: String },
  reason: { type: String },
  pay: { type: String },
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('bill-histories', billHistorySchema);
