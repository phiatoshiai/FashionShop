'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  gender: { type: String },
  address: { type: String },
  avatarUrl: { type: String },
  point: { type: Number },
  refer: {
    customer: Schema.Types.ObjectId,
    referDate: { type: Date },
  },
  roles: [String],
  social: {
    provider: { type: String },
    id: { type: String },
  },
  reject: { type: Number },
  token: { type: String },
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

module.exports = mongoose.model('UserModel', userSchema, 'users');
