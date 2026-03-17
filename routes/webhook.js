const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/order-update", async (req, res) => {

  const order = req.body;
  const tags = (order.tags || "").toLowerCase();

  console.log("Order ID:", order.id);
  console.log("Tags:", tags);

  // ✅ IMPORTANT: Latest stage priority logic
  if(tags.includes("packing done")){
    await sendTemplate(order,"order_update_packing_v3");
  }
  else if(tags.includes("stitching done")){
    await sendTemplate(order,"order_update_stitching_v3");
  }
  else if(tags.includes("fusing done")){
    await sendTemplate(order,"order_update_fusing_v3");
  }
  else if(tags.includes("printing done")){
    await sendTemplate(order,"order_update_printing_v3");
  }
  else if(tags.includes("design done")){
    await sendTemplate(order,"order_update_design_v3");
  }

  res.sendStatus(200);
});



// 🔥 FINAL WORKING FUNCTION
async function sendTemplate(order, templateName){

  try{

    const rawPhone = order.shipping_address?.phone || "";

    // clean phone (remove spaces, +, -)
    let phone = rawPhone.replace(/\D/g, "");

    // take last 10 digits
    phone = phone.slice(-10);

    const customerName =
      order.customer?.first_name ||
      order.shipping_address?.first_name ||
      "Customer";

    const orderId = order.name || order.id;

    if(!phone){
      console.log("❌ No valid phone number");
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