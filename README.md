# 🤖 SSC Quiz Bot


An interactive Telegram bot leveraging **Google Gemini AI** to provide dynamic, timed quizzes for SSC CGL, CPO, and CHSL exam aspirants. Get instant feedback and explanations to boost your preparation.

---

## ✨ Features

* **AI-Powered Quizzes:** Generates unique multiple-choice questions for SSC CGL, CPO, and CHSL using `gemini-1.5-flash-lite`.
* **Comprehensive Coverage:** Questions span General Awareness, General Intelligence & Reasoning, and English Language.
* **Timed Responses:** Answer each question within a **40-second limit** (Working on this)
* **Instant Feedback:** Receive immediate correctness feedback with detailed explanations.
* **User Control:** Option to stop any active quiz session.

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18+)
* npm (Node Package Manager)
* [Telegram Bot Token](https://core.telegram.org/bots/tutorial)
* [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/codeagrim/SSC-Telegram-Chatbot](git@github.com:codeagrim/SSC-Telegram-Chatbot.git)
    cd ssc-quiz-bot
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure environment variables:**
    Create a `.env` file in the project root:
    ```env
    TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    PORT=3000 # Or any desired port
    ```

### Running the Bot

```bash
npm start