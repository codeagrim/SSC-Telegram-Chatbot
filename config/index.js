// config/index.js
require('dotenv').config();

module.exports = {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    geminiApiKey: process.env.GEMINI_API_KEY,
    port: process.env.PORT || 3000,
    // Add any other global configurations here
};