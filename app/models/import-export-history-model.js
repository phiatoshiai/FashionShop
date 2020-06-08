'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var importExportHistorySchema = new Schema({
  warehouse: { type: Schema.Types.ObjectId, ref: 'WarehouseModel' },
  type: { type: String },
  qty: { type: Number, default: 0 },
  reason: { type: String },
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  'ImportExportHistoryModel',
  importExportHistorySchema,
  'import-export-histories'
);
