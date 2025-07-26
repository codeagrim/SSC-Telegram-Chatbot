// controllers/quizController.js
const telegramService = require('../services/telegramService');
const geminiService = require('../services/geminiService');
const quizPrompts = require('../utils/quizPrompts');

const userQuizState = {}; // {chat_id: {quiz_data: {...}, current_question_index: 0, score: 0}}

// Helper function to send the main menu
async function sendMainMenu(chatId, message = "Welcome to the SSC Quiz Bot! Choose a quiz type:") {
    const inlineKeyboard = {
        inline_keyboard: [
            [{ text: 'SSC CGL Quiz', callback_data: 'start_quiz_cgl' }],
            [{ text: 'SSC CPO Quiz', callback_data: 'start_quiz_cpo' }],
            [{ text: 'SSC CHSL Quiz', callback_data: 'start_quiz_chsl' }]
        ]
    };

    await telegramService.sendMessage(chatId, message, {
        reply_markup: inlineKeyboard
    });
}


async function handleStartCommand(msg) {
    const chatId = msg.chat.id;
    await sendMainMenu(chatId);
}

async function handleQuizCommand(msg, match) {
    const chatId = msg.chat.id;
    const quizType = match[1] ? match[1].toLowerCase() : null;

    if (!quizType || !['cgl', 'cpo', 'chsl'].includes(quizType)) {
        await telegramService.sendMessage(chatId, "Invalid quiz type. Please use /quiz cgl, /quiz cpo, or /quiz chsl.");
        return;
    }

    await telegramService.sendMessage(chatId, `Generating a ${quizType.toUpperCase()} quiz for you... This might take a moment.`);

    try {
        const prompt = quizPrompts.generateQuizPrompt(quizType);
        const quizDataList = await geminiService.generateQuizQuestions(prompt);

        const quizTitle = `${quizType.toUpperCase()} Quiz`;
        const fullQuizData = {
            quiz_title: quizTitle,
            category: quizType.toUpperCase(),
            questions: quizDataList
        };

        userQuizState[chatId] = {
            quiz_data: fullQuizData,
            current_question_index: 0,
            score: 0
        };

        await sendQuestion(chatId);

    } catch (error) {
        console.error("Error in handleQuizCommand:", error.message);
        await telegramService.sendMessage(chatId, "Sorry, I couldn't generate the quiz right now. Please try again later.");
    }
}

async function handleCallbackQuery(callbackQuery) {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data; // e.g., "answer_0" or "stop_quiz"
    const callbackQueryId = callbackQuery.id;

    await telegramService.answerCallback(callbackQueryId); // Acknowledge the callback query

    // Handle stop quiz button
    if (data === 'stop_quiz') {
        if (userQuizState[chatId]) {
            delete userQuizState[chatId]; // Clear quiz state
            await telegramService.editMessage(
                chatId,
                msg.message_id,
                "Quiz stopped. Returning to main menu."
            );
        }
        await sendMainMenu(chatId); // Show main menu
        return; // Stop further processing
    }

    // Existing answer handling logic
    if (!userQuizState[chatId] || !userQuizState[chatId].quiz_data || !userQuizState[chatId].quiz_data.questions) {
        await telegramService.sendMessage(chatId, "No active quiz for you! Please start one with /quiz cgl, /quiz cpo, or /quiz chsl.");
        return;
    }

    const quizState = userQuizState[chatId];
    const currentQuestionIndex = quizState.current_question_index;
    const questions = quizState.quiz_data.questions;

    if (currentQuestionIndex >= questions.length) {
        await telegramService.sendMessage(chatId, "This quiz has already ended.");
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const selectedOptionIndex = parseInt(data.split('_')[1]); // Assumes data is 'answer_X'
    const correctOptionIndex = questionData.correct_answer_index;

    let feedbackMessage = "";
    if (selectedOptionIndex === correctOptionIndex) {
        quizState.score++;
        feedbackMessage = `✅ Correct!\n\n${questionData.explanation}`;
    } else {
        const correctOptionText = questionData.options[correctOptionIndex];
        feedbackMessage = `❌ Incorrect. The correct answer was: ${String.fromCharCode(65 + correctOptionIndex)}. ${correctOptionText}\n\n${questionData.explanation}`;
    }

    // Edit the previous message to show feedback
    await telegramService.editMessage(
        chatId,
        msg.message_id,
        `${msg.text}\n\n*${feedbackMessage}*\n\n_Moving to next question..._`,
        { parse_mode: 'Markdown' }
    );

    quizState.current_question_index++;

    // Send the next question after a short delay for better UX
    setTimeout(async () => {
        await sendQuestion(chatId);
    }, 3000); // 3 seconds delay
}

async function sendQuestion(chatId) {
    const quizState = userQuizState[chatId];

    if (!quizState || !quizState.quiz_data || !quizState.quiz_data.questions) {
        await telegramService.sendMessage(chatId, "Error: Quiz state not found or invalid. Please start a new quiz.");
        return;
    }

    const questions = quizState.quiz_data.questions;
    const currentQuestionIndex = quizState.current_question_index;

    if (currentQuestionIndex >= questions.length) {
        await telegramService.sendMessage(chatId, `Quiz finished! Your score: ${quizState.score} out of ${questions.length}.`);
        delete userQuizState[chatId]; // Clear quiz state for this user
        await sendMainMenu(chatId); // Show main menu after quiz finished
        return;
    }

    const questionData = questions[currentQuestionIndex];
    const questionText = `Q${currentQuestionIndex + 1}: ${questionData.question}`;

    const answerButtons = questionData.options.map((option, i) => ([
        { text: `${String.fromCharCode(65 + i)}. ${option}`, callback_data: `answer_${i}` }
    ]));

    // Add the "Stop Quiz" button to the inline keyboard
    const stopButton = [{ text: '⏹️ Stop Quiz', callback_data: 'stop_quiz' }];
    const inlineKeyboard = {
        inline_keyboard: [...answerButtons, stopButton] // Combine answer buttons and stop button
    };

    await telegramService.sendMessage(chatId, questionText, {
        reply_markup: inlineKeyboard
    });
}

module.exports = {
    handleStartCommand,
    handleQuizCommand,
    handleCallbackQuery,
    sendMainMenu // Export if you need to call it from index.js directly for other commands
};