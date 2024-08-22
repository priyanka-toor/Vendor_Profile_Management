const express = require("express");
const { connectToMongoDB } = require("./createVendor");

const rootRouter = require("./app_index");
const cors = require("cors");
const { setUpEvents } = require("./metrics");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);

setUpEvents();
connectToMongoDB();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
