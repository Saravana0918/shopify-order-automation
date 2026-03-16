const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/order-update", async (req, res) => {

  const order = req.body;
  const tags = (order.tags || "").toLowerCase();

  console.log("Order ID:", order.id);
  console.log("Tags:", tags);

  if(tags.includes("design done")){
    sendTemplate(order,"order_update_design");
  }

  if(tags.includes("printing done")){
    sendTemplate(order,"order_update_printing");
  }

  if(tags.includes("fusing done")){
    sendTemplate(order,"order_update_fusing");
  }

  if(tags.includes("stitching done")){
    sendTemplate(order,"order_update_stitching");
  }

  if(tags.includes("packing done")){
    sendTemplate(order,"order_update_packing");
  }

  res.sendStatus(200);

});



async function sendTemplate(order, templateName){

  try{

    const phone = order.shipping_address.phone;

    const customerName =
      order.customer?.first_name ||
      order.shipping_address?.first_name ||
      "Customer";

    await axios.post(
      process.env.WHATSAPP_API_URL,
      {
        phoneNumber: phone,
        type: "Template",
        template: {
          name: templateName,
          languageCode: "en",
          bodyValues: [
            customerName
          ]
        }
      },
      {
        headers:{
          Authorization: `Basic ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type":"application/json"
        }
      }
    );

    console.log("Template sent:", templateName);

  }
  catch(err){

    console.log(
      "WhatsApp error",
      err.response?.data || err.message
    );

  }

}

module.exports = router;