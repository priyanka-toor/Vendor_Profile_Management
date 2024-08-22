const express = require("express");
const {
  vendorExists,
  createVendor,
  vendor,
  verifyPassword,
  hashPassword,
} = require("./createVendor");
const zodVendor = require("./zod_vendor");
const signIn = require("./signIn");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./userAuth");
const vendorUpdate = require("./update");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { success, data } = zodVendor.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid vendor data" });
    }

    const existingVendor = await vendorExists(data);
    if (existingVendor) {
      return res.status(403).json({ message: "Vendor already exists" });
    }

    const newVendor = await createVendor(data);

    return res
      .status(201)
      .json({ message: "Vendor created successfully", vendor: newVendor });
  } catch (e) {
    console.error("Error creating vendor:", e);
    return res.status(500).json({ message: "Failed to create vendor" });
  }
});

router.get("/", async (req, res) => {
  try {
    const vendors = await vendor.find({});
    return res.status(200).json({ vendors });
  } catch (e) {
    console.error("Error fetching vendors:", e);
    return res.status(500).json({ message: "Failed to fetch vendors" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { success, data } = signIn.safeParse(req.body);
    if (!success) {
      return res
        .status(400)
        .json({ message: "Invalid vendorCode or password" });
    }

    const existingVendor = await vendorExists(data);
    if (!existingVendor) {
      return res
        .status(404)
        .json({ message: "Vendor doesn't exists. Please signup first." });
    }

    const verified = await verifyPassword(
      data.password,
      existingVendor.password
    );
    if (!verified) {
      return res
        .status(403)
        .json({
          message:
            "Incorrect password. Please double-check your password and try again.",
        });
    }

    const token = jwt.sign(
      { vendorCode: existingVendor.vendorCode, role: existingVendor.role },
      process.env.JWT_SECRET
    );

    return res
      .status(200)
      .json({ token, role: existingVendor.role, name: existingVendor.name });
  } catch (e) {
    console.error("Error during sign-in: ", e);
    return res.status(500).json({ message: "Failed to sign in." });
  }
});

router.get("/:vendorCode", async (req, res) => {
  try {
    const vendorCode = req.params.vendorCode;
    const foundVendor = await vendor.findOne({ vendorCode });
    if (!foundVendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    return res.status(200).json({ foundVendor });
  } catch (e) {
    console.error("Error during retrieving vendor details", e);
    return res
      .status(500)
      .json({ message: "Failed to retrieve vendor details." });
  }
});

router.put("/:vendorCode", authMiddleware, async (req, res) => {
  try {
    const vendorCode = req.params.vendorCode;
    const { success, data } = vendorUpdate.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid vendor data" });
    }

    if (data.password) {
      data.password = await hashPassword(data.password, 10);
    }

    const updateSuccess = await vendor.updateOne({ vendorCode }, data);
    if (updateSuccess.nModified === 0) {
      return res
        .status(404)
        .json({ message: "Vendor not found or no changes were made." });
    }

    return res
      .status(200)
      .json({ message: "Successfully updated vendor details." });
  } catch (e) {
    console.error("Error while updating vendor details: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:vendorCode", authMiddleware, async (req, res) => {
  try {
    const vendorCode = req.params.vendorCode;
    const success = await vendor.deleteOne({ vendorCode });
    if (success.deletedCount === 0) {
      return res.status(404).json({ message: "Error deleting vendor" });
    }

    return res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (e) {
    console.error("Error while deleting vendor details: ", e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:vendorCode/performance", authMiddleware, async (req, res) => {});

module.exports = router;
