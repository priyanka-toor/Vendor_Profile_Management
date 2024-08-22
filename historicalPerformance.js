const mongoose = require("mongoose");

const historicalPerformanceSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  onTimeDeliveryRate: {
    type: Number,
    required: true,
  },
  qualityRatingAvg: {
    type: Number,
    required: true,
  },
  averageResponseTime: {
    type: Number,
    required: true,
  },
  fulfillmentRate: {
    type: Number,
    required: true,
  },
});

module.exports = historicalPerformanceSchema;
