const axios = require("axios");
const apiUrl = process.env.WHATSAPP_API_URL;
const apiKey = process.env.WHATSAPP_API_KEY;

// ======================whatsapp send otp ====================== //

const sendOtp = async (mobile, otp) => {
  const data = {
    apiKey: apiKey,
    campaignName: "otp_verification_new_new",
    destination: mobile,
    userName: "Learn More",
    templateParams: [otp],
    source: "node js",
    media: {},
    buttons: [],
    carouselCards: [],
    location: {
      latitude: "22.5726° N",
      longitude: "88.3639° E",
      address: "kolkata",
      name: "Hello",
    },
    attributes: {},
    paramsFallbackValue: {
      FirstName: "user",
    },
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: { "Content-Type": "application/json" },
    });

    if (!response) {
      console.log(`Whatsapp api is not giving response`);
      return;
    }

    console.log(response.data);
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response ? error.response.data : error.message
    );

    return error;
  }
};

//
module.exports = sendOtp;
