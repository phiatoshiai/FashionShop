'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
  pictureUrl: { type: String },
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('news', newsSchema);
