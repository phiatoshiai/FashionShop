'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var billSchema = new Schema({
  products: [
    {
      id: Schema.Types.ObjectId,
      name: { type: String },
      pcs: { type: String },
      unit: { type: String },
      amount: { type: Number },
    },
  ],
  customer: {
    id: Schema.Types.ObjectId,
    name: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    note: { type: String },
  },
  pay: {
    type: String,
    enum: [
      '7a02aec7-32a7-48d6-aa2e-1359a81926ac', // Point - Cash
      '297becb3-7c05-4f84-bf5b-f6bbc4d8bda9', // Point - Transfer
      '3e6bdea0-16ab-48b5-be2f-76701f400311', // Point
      'c1c12ea5-9d0f-42f9-91e1-744a39d427f4', // Cash - Transfer
      'dd6f28c1-a49a-45ad-8db5-c581321aa664', // Cash
      'cb27be0b-e173-4cb5-a7fa-f8c1d452b998', // Transfer
    ],
  },
  status: {
    type: String,
    enum: [
      '60fda515-7aca-498e-80fe-e93d1dd6dd94', // Pending
      '20105183-5743-4e68-95ea-67743d032125', // WaitPay
      '97dd8156-054b-4713-a68c-bba5f5dac309', // Success
      'ad2f151d-117a-4067-94cc-3ca5d7d8b77f', // Reject
    ],
  },
  reason: { type: String },
  totalAmount: { type: Number },
  codes: [
    {type: String}
  ],
  // Filtering
  activated: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
  // Auditing
  createdBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('bills', billSchema);
