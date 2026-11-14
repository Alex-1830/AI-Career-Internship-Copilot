# AI Career & Internship Copilot 🚀

An AI-powered career assistant designed to help students analyze their resumes, identify skill gaps, explore career opportunities, and manage internship applications.

## 📌 About the Project

Students often struggle to identify suitable career paths, understand the skills required by companies, and find relevant internship opportunities.

**AI Career & Internship Copilot** addresses these challenges using Artificial Intelligence and a centralized career management platform.

It analyzes student resumes, recommends suitable career paths, generates personalized learning plans, and helps students track their internship applications and skill development.

## ✨ Key Features

- **User Authentication:** Secure registration and login using JWT authentication.
- **Resume Analyzer:** Upload PDF resumes and extract relevant information and skills.
- **AI Career Planner:** Generate personalized career recommendations and learning roadmaps.
- **Skill Gap Analysis:** Identify skills that need improvement.
- **Project Recommendations:** Suggest projects based on career goals and skills.
- **Internship Tracker:** Add and manage internship applications.
- **Skill Tracker:** Add skills manually and monitor learning progress.
- **Dashboard:** View career plans, resumes, applications, and skill progress in one place.

## 🛠️ Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Axios
- Vite

### Backend
- Python
- FastAPI
- REST APIs
- JWT Authentication

### Database
- MySQL

### AI Integration
- Google Gemini API
- Python-based skill extraction and analysis

## 🏗️ System Architecture

The application follows a frontend-backend-database architecture.

1. **Frontend:** React provides the user interface.
2. **Backend:** FastAPI handles authentication, business logic, and API requests.
3. **AI Services:** Gemini integration supports career planning and recommendations.
4. **Database:** MySQL stores user information, resumes, career plans, internship applications, and skill progress.

## 📂 Project Structure

```text
AI-Career-Internship-Copilot/
│
├── backend/
│   ├── agents/
│   ├── database/
│   ├── services/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Alex-1830/AI-Career-Internship-Copilot.git
```

```bash
cd AI-Career-Internship-Copilot
```

### 2. Backend Setup

Create and activate a Python virtual environment:

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

Configure the required environment variables for MySQL, Gemini API, and JWT authentication in your backend `.env` file. Use the exact variable names expected by your application.

Create and configure the MySQL database before starting the backend.

Start the backend:

```bash
uvicorn backend.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

## 🔐 Security

- API keys and passwords must be stored in environment variables.
- The `.env` file must not be uploaded to GitHub.
- Authentication uses JWT tokens.
- Protected pages require authentication.

## 🎯 Project Objectives

- Simplify career planning for students.
- Improve resume quality and skill awareness.
- Recommend personalized learning paths.
- Help students organize internship applications.
- Encourage continuous skill development.

## 👨‍💻 Developer

**Alexander Paul K**

AI Career & Internship Copilot

GitHub: https://github.com/Alex-1830

## 📌 Future Enhancements

- Real-time internship recommendations.
- Automated resume scoring.
- Job description and resume matching.
- Personalized AI career chatbot.
- Email notifications for internship opportunities.

---

⭐ If you find this project interesting, feel free to explore the repository!