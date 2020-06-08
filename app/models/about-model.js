'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var aboutSchema = new Schema({
  icon: { type: String },
  values: [
    {
      title: { type: String },
      content: { type: String },
      lang: { type: String },
    },
  ],
  type: { type: String },
  // Filtering
  slug: { type: String },
  tags: [String],
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('AboutModel', aboutSchema, 'abouts');
