const zod = require("zod");

const zodPurchaseOrder = zod.object({
  poNumber: zod.string(),
  vendor: zod.string(),
  orderDate: zod.string(),
  deliveryDate: zod.string().optional(),
  expectedDeliveryDate: zod.string(),
  items: zod.record(zod.string(), zod.number()),
  quantity: zod.number(),
  status: zod.enum(["pending", "completed", "canceled"]).optional(),
  qualityRating: zod.number().optional(),
  issueDate: zod.date().optional(),
  acknowledgementDate: zod.date().optional(),
});

module.exports = zodPurchaseOrder;
