const zod = require("zod");

const signIn = zod.object({
  vendorCode: zod.string(),
  password: zod.string().min(8),
});

module.exports = signIn;
