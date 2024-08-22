require("dotenv").config();
const mongoose = require("mongoose");
const vendorSchema = require("./vendor");
const purchaseOrderSchema = require("./purchaseOrder");
const historicalPerformanceSchema = require("./historicalPerformance");
const bcrypt = require("bcrypt");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Connected to MongoDB...");
  } catch (e) {
    console.log("MongoDB connection error:", e);
  }
}

const vendor = mongoose.model("Vendor", vendorSchema);
const purchaseOrder = mongoose.model("Purchase Order", purchaseOrderSchema);
const historicalPerformance = mongoose.model(
  "Historical Performance",
  historicalPerformanceSchema
);

async function vendorExists({ vendorCode }) {
  return vendor.findOne({ vendorCode: vendorCode });
}

async function purchaseOrderExists({ poNumber }) {
  return purchaseOrder.findOne({ poNumber: poNumber });
}

async function hashPassword(password, saltRounds) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error("Error hashing password: ", err);
        reject();
      } else {
        resolve(hash);
      }
    });
  });
}

async function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        console.error("Error verifying password: ", err);
        reject();
      } else {
        resolve(result);
      }
    });
  });
}

async function createVendor({
  name,
  contactDetails,
  address,
  vendorCode,
  password,
  onTimeDeliveryRate,
  qualityRatingAvg,
  averageResponseTime,
  fulfillmentRate,
}) {
  const hashPass = await hashPassword(password, 10);
  const vendorData = {
    name,
    contactDetails,
    address,
    vendorCode,
    password: hashPass,
  };

  if (onTimeDeliveryRate !== undefined) {
    vendorData.onTimeDeliveryRate = onTimeDeliveryRate;
  }
  if (qualityRatingAvg !== undefined) {
    vendorData.qualityRatingAvg = qualityRatingAvg;
  }
  if (averageResponseTime !== undefined) {
    vendorData.averageResponseTime = averageResponseTime;
  }
  if (fulfillmentRate !== undefined) {
    vendorData.fulfillmentRate = fulfillmentRate;
  }

  return vendor.create(vendorData);
}

async function createPurchaseOrder({
  poNumber,
  vendor,
  orderDate,
  deliveryDate,
  expectedDeliveryDate,
  items,
  quantity,
  status,
  qualityRating,
  issueDate,
  acknowledgementDate,
}) {
  const purchaseOrderData = {
    poNumber,
    vendor,
    orderDate,
    deliveryDate,
    expectedDeliveryDate,
    items,
    quantity,
  };

  if (status !== undefined) {
    purchaseOrderData.status = status;
  }
  if (qualityRating !== undefined) {
    purchaseOrderData.qualityRating = qualityRating;
  }
  if (issueDate !== undefined) {
    purchaseOrderData.issueDate = issueDate;
  }
  if (acknowledgementDate !== undefined) {
    purchaseOrderData.acknowledgementDate = acknowledgementDate;
  }

  return purchaseOrder.create(purchaseOrderData);
}

module.exports = {
  connectToMongoDB,
  vendor,
  purchaseOrder,
  historicalPerformance,
  vendorExists,
  createVendor,
  hashPassword,
  verifyPassword,
  purchaseOrderExists,
  createPurchaseOrder,
};
