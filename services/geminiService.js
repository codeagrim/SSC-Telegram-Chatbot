// services/geminiService.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

/**
 * Generates quiz questions using Google Gemini AI.
 * @param {string} prompt The prompt string to send to Gemini.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of quiz question objects.
 */
async function generateQuizQuestions(prompt) {
    try {
        const result = await model.generateContent(prompt);
        let generatedText = result.response.text();

        // Clean up markdown code block if Gemini includes it
        if (generatedText.startsWith('```json')) {
            generatedText = generatedText.replace('```json\n', '').replace('\n```', '');
        }

        const quizDataList = JSON.parse(generatedText);
        return quizDataList;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate quiz questions from AI.");
    }
}

module.exports = {
    generateQuizQuestions
};