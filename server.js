require("dotenv").config();

const express = require("express");
const webhookRoutes = require("./routes/webhook");

const app = express();

app.use(express.json());

app.use("/webhook", webhookRoutes);

app.get("/", (req, res) => {
  res.send("Shopify Order Automation Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});