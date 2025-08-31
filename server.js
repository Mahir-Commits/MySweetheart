require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const path = require("path");



const app = express();
const PORT = process.env.PORT || 3000;

// Twilio credentials (⚠️ move these to environment variables in production!)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886";
const YOUR_WHATSAPP_NUMBER = "whatsapp:+918279935641";

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files (CSS, JS, HTML)

// Serve question.html as default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/question.html"));
});

// Handle form submission
app.post("/submit", async (req, res) => {
  const answers = req.body;

  // Create message body for WhatsApp
  let messageBody = "📩 Love Form Submitted ❤️\n\n";
  for (let i = 1; i <= 52; i++) {
    messageBody += `Q${i}. → ${answers[`answer${i}`] || "No answer"}\n`;
  }

  try {
    await client.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: YOUR_WHATSAPP_NUMBER,
      body: messageBody,
    });

    res.send("Success: Answers sent to WhatsApp!");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Failed to send answers.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
