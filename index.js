// index.js
const express = require('express');
const config = require('./config');
const telegramService = require('./services/telegramService');
const quizController = require('./controllers/quizController');

const app = express();
const bot = telegramService.getBotInstance(); // Get the initialized bot instance

// --- Express Middleware ---
app.use(express.json()); // For parsing application/json

// Basic route for health check or deployment testing
app.get('/', (req, res) => {
    res.send('Telegram Quiz Bot is running!');
});

// --- Telegram Bot Listeners ---
bot.onText(/\/start/, quizController.handleStartCommand);

// The /quiz command handler remains for direct text input of commands
bot.onText(/\/quiz (.+)/, quizController.handleQuizCommand); 

// Handle all callback queries, including the new 'start_quiz_xxx' ones
bot.on('callback_query', async (callbackQuery) => {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;

    if (data.startsWith('start_quiz_')) {
        const quizType = data.replace('start_quiz_', ''); // Extract 'cgl', 'cpo', 'chsl'
        // Simulate the /quiz command call
        await quizController.handleQuizCommand(callbackQuery.message, [null, quizType]); // Pass null for full match and quizType as captured group
    } else if (data.startsWith('answer_') || data === 'stop_quiz') {
        // This is an answer to a quiz question, let the existing handler deal with it
        await quizController.handleCallbackQuery(callbackQuery);
    } else {
        // Handle any other unexpected callback data
        await telegramService.answerCallback(callbackQuery.id, "Unknown action.");
        await telegramService.sendMessage(chatId, "I'm not sure what you meant by that. Please use the commands or quiz options.");
    }
});



// --- Start Express Server ---
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log('Telegram Bot polling for updates...');
});