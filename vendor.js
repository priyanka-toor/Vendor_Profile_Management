const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  vendorCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  onTimeDeliveryRate: { type: Number, default: 0 },
  qualityRatingAvg: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 },
  fulfillmentRate: { type: Number, default: 0 },
});

module.exports = { vendorSchema };
