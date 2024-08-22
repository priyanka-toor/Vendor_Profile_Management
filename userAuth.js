const jwt = require("jsonwebtoken");
//const path = require("path");
const vendor = require("./vendor");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ message: "Invalid token" });
    }

    const vendorCode = decoded.vendorCode;
    const vendorData = await vendor.findOne({ vendorCode });
    if (vendorData) {
      req.body.vendor = vendorData._id.toString();
      console.log("Vendor: ", req.body.vendor);
    }
    next();
  });
}

module.exports = authMiddleware;
