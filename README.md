<div align="center">

<img src="https://github.com/user-attachments/assets/f4c2cdbe-7222-49fb-b1cd-9861cfb77b1e" alt="AI-Driven Code Reviewer Logo" width="120" height="120" style="border-radius: 50%;" />

# AI-Driven Code Reviewer

### An intelligent platform that analyzes code, detects errors, improves code quality, and optimizes performance using advanced AI models.

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

[🚀 Live Demo](#) &nbsp;|&nbsp; [📖 Documentation](#features) &nbsp;|&nbsp; [🐛 Report Bug](https://github.com/RohithReddyGK/AI-Driven-Code-Reviewer/issues) &nbsp;|&nbsp; [✨ Request Feature](https://github.com/RohithReddyGK/AI-Driven-Code-Reviewer/issues)

</div>

---

## ✨ Features

- 🧠 **AI-Powered Code Review** — Deep analysis using advanced AI models with structured review summaries
- ✏️ **Monaco Code Editor** — Full-featured browser editor (same engine as VS Code) with syntax highlighting for 6 languages
- ⚡ **Quick Analyze** — Paste code and instantly get a complete AI review without the editor
- 📊 **Complexity Analysis** — Time & Space complexity breakdown for current and optimized code with visual SVG charts
- 🚀 **Optimized Code Suggestions** — AI generates a more efficient version of your code with one-click "Apply" support
- 💡 **Improvement Suggestions** — Numbered, actionable fix cards with copy & apply buttons
- 🔍 **Language Detection** — Automatically detects mismatched languages and alerts you with a mismatch banner
- 🤖 **AI Chat Bubble** — Floating contextual chat assistant aware of your current code and analysis
- 📜 **Analysis History** — Sidebar with timestamped history of all past analyses, restoreable with one click
- 📄 **PDF Export** — Download a full formatted HTML/PDF report of any analysis
- 🌙 **Dark Mode** — Full dark/light theme toggle across all pages
- 📱 **Fully Mobile Responsive** — Optimized for all screen sizes with a tabbed Editor/Review panel switcher on mobile
- 🌐 **Multi-Language Support** — JavaScript, Python, Java, C++, C, Go

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://reactjs.org/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Monaco Editor](https://github.com/suren-atoyan/monaco-react) | Code Editor |
| [Lottie Web](https://github.com/airbnb/lottie-web) | Lottie Animations |
| [Lucide React](https://lucide.dev/) | Icons |
| [React Router](https://reactrouter.com/) | Routing |

### Backend
| Technology | Purpose |
|---|---|
| [Python 3.10+](https://www.python.org/) | Backend Language |
| [Flask](https://flask.palletsprojects.com/) | REST API Server |
| [Flask-CORS](https://flask-cors.readthedocs.io/) | Cross-Origin Requests |
| AI/LLM API | Code Analysis Engine |

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [Git](https://git-scm.com/)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/RohithReddyGK/AI-Driven-Code-Reviewer.git
cd AI-Driven-Code-Reviewer
```

---

### 2️⃣ Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be live at **`http://localhost:5173`**

---

### 3️⃣ Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python app.py
```

The backend API will be running at **`http://127.0.0.1:5000`**

---

### 4️⃣ Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
AI_API_KEY=your_api_key_here
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 🚀 Usage Guide

### Code Editor
1. Navigate to **Analyze Code → Code Editor**
2. Select your programming language from the dropdown
3. Write or paste your code in the Monaco editor
4. Click **"Analyze Code"** to get a full AI review
5. View the **Review Summary**, **Complexity Analysis**, **Optimized Version**, and **Suggestions**
6. Click **"Apply"** on any suggestion to instantly replace your code
7. Use the **History** sidebar to revisit past analyses
8. Export your analysis as a **PDF report**

### Quick Analyze
1. Navigate to **Analyze Code → Quick Analyze**
2. Paste your code in the text area
3. Select the language
4. Click **"Quick Analyze"** for an instant lightweight review

### AI Chat Bubble
- The floating 🤖 button (bottom-right) opens a context-aware AI chat
- It knows your current code and last analysis — ask it anything!

---

## 🌐 Supported Languages

| Language | Extension | Detection |
|---|---|---|
| JavaScript | `.js` | ✅ Auto-detect |
| Python | `.py` | ✅ Auto-detect |
| Java | `.java` | ✅ Auto-detect |
| C++ | `.cpp` | ✅ Auto-detect |
| C | `.c` | ✅ Auto-detect |
| Go | `.go` | ✅ Auto-detect |

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "Add AmazingFeature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

Please make sure your code follows the existing style and all pages remain mobile responsive.

---

## 👨‍💻 Author

<div align="center">

**Rohith Reddy G K**

[![GitHub](https://img.shields.io/badge/GitHub-RohithReddyGK-181717?style=for-the-badge&logo=github)](https://github.com/RohithReddyGK)

⭐ If you found this project useful, please consider giving it a **star**!

</div>
