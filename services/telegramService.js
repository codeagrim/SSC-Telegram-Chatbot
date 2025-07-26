// services/telegramService.js
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config');

const bot = new TelegramBot(config.telegramBotToken, { polling: true });

// Expose the bot instance for registering listeners in quizController
function getBotInstance() {
    return bot;
}

/**
 * Sends a text message to a chat.
 * @param {number} chatId The ID of the chat.
 * @param {string} text The text message to send.
 * @param {Object} [options={}] Optional parameters for sendMessage (e.g., reply_markup).
 */
async function sendMessage(chatId, text, options = {}) {
    try {
        await bot.sendMessage(chatId, text, options);
    } catch (error) {
        console.error(`Error sending message to ${chatId}:`, error);
    }
}

/**
 * Edits a message in a chat.
 * @param {number} chatId The ID of the chat.
 * @param {number} messageId The ID of the message to edit.
 * @param {string} text The new text for the message.
 * @param {Object} [options={}] Optional parameters for editMessageText.
 */
async function editMessage(chatId, messageId, text, options = {}) {
    try {
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...options });
    } catch (error) {
        console.error(`Error editing message ${messageId} in ${chatId}:`, error);
    }
}

/**
 * Acknowledges a callback query.
 * @param {string} callbackQueryId The ID of the callback query.
 * @param {string} [text] Optional text to show in a pop-up alert.
 * @param {boolean} [showAlert=false] Whether to show an alert or just a toast.
 */
async function answerCallback(callbackQueryId, text = '', showAlert = false) {
    try {
        await bot.answerCallbackQuery(callbackQueryId, { text, show_alert: showAlert });
    } catch (error) {
        console.error(`Error answering callback query ${callbackQueryId}:`, error);
    }
}

module.exports = {
    getBotInstance,
    sendMessage,
    editMessage,
    answerCallback
};