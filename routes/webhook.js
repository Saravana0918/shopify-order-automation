const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/order-update", async (req, res) => {

  const order = req.body;
  const tags = (order.tags || "").toLowerCase();

  console.log("Order ID:", order.id);
  console.log("Tags:", tags);

  if(tags.includes("design done")){
    sendTemplate(order,"order_update_design_v3");
  }

  if(tags.includes("printing done")){
    sendTemplate(order,"order_update_printing_v3");
  }

  if(tags.includes("fusing done")){
    sendTemplate(order,"order_update_fusing_v3");
  }

  if(tags.includes("stitching done")){
    sendTemplate(order,"order_update_stitching_v3");
  }

  if(tags.includes("packing done")){
    sendTemplate(order,"order_update_packing_v3");
  }

  res.sendStatus(200);

});



async function sendTemplate(order, templateName){

  try{

    const rawPhone = order.shipping_address?.phone || "";

    // clean phone
    let phone = rawPhone.replace(/\D/g, "");

    // take last 10 digits
    phone = phone.slice(-10);

    const customerName =
      order.customer?.first_name ||
      order.shipping_address?.first_name ||
      "Customer";

    const orderId = order.name || order.id;

    if(!phone){
      console.log("No valid phone");
      return;
    }

    await axios.post(
      process.env.WHATSAPP_API_URL,
      {
        countryCode: "91",
        phoneNumber: phone,
        type: "Template",
        template: {
          name: templateName,
          languageCode: "en",
          bodyValues: [
            customerName,
            orderId
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

    console.log("✅ Template sent:", templateName);

  }
  catch(err){

    console.log(
      "❌ WhatsApp error",
      err.response?.data || err.message
    );

  }

}

module.exports = router;