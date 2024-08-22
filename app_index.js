const express = require("express");
const vendorRouter = require("./app_vendor");
const purchaseOrderRouter = require("./app_purchase_order");
const router = express.Router();

router.use("/vendors", vendorRouter);
router.use("/purchase_order", purchaseOrderRouter);

module.exports = router;
