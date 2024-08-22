const mongoose = require("mongoose");

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: {
    type: String,
    unique: true,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
  expectedDeliveryDate: {
    type: Date,
    required: true,
  },
  items: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "canceled"],
    default: "pending",
  },
  qualityRating: {
    type: Number,
    default: null,
  },
  issueDate: {
    type: Date,
    default: Date.now(),
  },
  acknowledgementDate: {
    type: Date,
    default: null,
  },
});

module.exports = purchaseOrderSchema;
