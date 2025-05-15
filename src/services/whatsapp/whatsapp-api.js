const axios = require("axios");
const apiUrl = process.env.WHATSAPP_API_URL;
const apiKey = process.env.WHATSAPP_API_KEY;

// ====================== Send OTP via WhatsApp ====================== //

const sendOtp = async (mobile, otp) => {
  if (!apiUrl || !apiKey) {
    throw new Error("WhatsApp API URL or API Key is missing.");
  }

  const data = {
    apiKey,
    campaignName: "sc_app_otp_verify_login",
    destination: mobile,
    userName: "Learn More",
    templateParams: [otp],
    source: "new-landing-page form",
    media: {},
    buttons: [
      {
        type: "button",
        sub_type: "url",
        index: 0,
        parameters: [
          {
            type: "text",
            text: "Testing",
          },
        ],
      },
    ],
    carouselCards: [],
    location: {},
    attributes: {},
    paramsFallbackValue: {
      FirstName: "user",
    },
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("error response data", error.response.data);
      const message = error.response.data?.message || "An error occured";
      console.log(message);
      return {
        success: false,
        message,
      };
    } else if (error.request) {
      console.log("error request", error.request);
      return {
        success: false,
        message: "No response from server",
      };
    } else {
      console.log("unexpected error", error.message);
      return {
        success: false,
        message: "unexpected error occured",
      };
    }
  }
};

module.exports = sendOtp;
