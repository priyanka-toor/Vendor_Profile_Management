const zod = require("zod");

const zodVendor = zod.object({
  name: zod.string().max(30),
  role: zod.string().optional(),
  contactDetails: zod.string(),
  address: zod.string(),
  vendorCode: zod.string(),
  password: zod.string().min(8),
  onTimeDeliveryRate: zod.number().optional(),
  qualityRatingAvg: zod.number().optional(),
  averageResponseTime: zod.number().optional(),
  fulfillmentRate: zod.number().optional(),
});

module.exports = zodVendor;
