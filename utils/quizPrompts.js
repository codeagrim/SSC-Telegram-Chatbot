// utils/quizPrompts.js

const quizPrompts = {
    generateQuizPrompt: (quizType, numQuestions = 5) => {
        let title = "";
        let topic = "";
        let specificInstructions = "";

        switch (quizType.toLowerCase()) {
            case "cgl":
                title = "SSC CGL General Awareness Quiz";
                topic = "General Awareness (History, Geography, Polity, Science, Current Affairs)";
                specificInstructions = "Ensure the questions are distinct and challenging, suitable for competitive exam preparation.";
                break;
            case "cpo":
                title = "SSC CPO General Intelligence Quiz";
                topic = "General Intelligence and Reasoning";
                specificInstructions = "Ensure the questions test analytical and logical reasoning skills.";
                break;
            case "chsl":
                title = "SSC CHSL English Language Quiz";
                topic = "English Language (Synonyms, Antonyms, Idioms, Grammar, Sentence Improvement)";
                specificInstructions = "Ensure the questions are distinct and suitable for the CHSL level.";
                break;
            default:
                throw new Error("Invalid quiz type specified.");
        }

        return `Generate ${numQuestions} multiple-choice quiz questions for the ${quizType.toUpperCase()} exam focusing on ${topic}. Each question should have exactly 4 options, and one correct answer. Provide the output in a JSON array format, where each object has 'id', 'question', 'options' (an array of strings), 'correct_answer_index' (0-indexed integer), and 'explanation' fields. ${specificInstructions}`;
    },
    // You can add more prompt types here if needed
};

module.exports = quizPrompts;