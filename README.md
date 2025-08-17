# 🚀 MERN Stack Online Learning App

This is a full-stack online learning platform with user authentication, course management, and an integrated AI course suggestion feature powered by ChatGPT. The application is built using the MERN stack, with a React Native frontend and a Node.js backend.

---

## ✨ Features

- **User Authentication:** Secure user registration and login with JWT.
- **Role-Based Access Control:** Differentiates between students and instructors.
- **Course Management:** Instructors can perform full CRUD (Create, Read, Update, Delete) operations on courses.
- **Course Enrollment:** Students can view courses and enroll in them.
- **Real-time AI Suggestions:** Integrates with the ChatGPT API to provide real-time, streamed course recommendations to students via Server-Sent Events (SSE).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v18.x or later)
- pnpm (or npm/yarn if you prefer)
- MongoDB (local or cloud instance like MongoDB Atlas)
- An OpenAI API Key for the ChatGPT integration

---

## 📂 Project Structure

├── backend/
│ ├── src/
│ ├── .env.example
│ ├── package.json
│ └── pnpm-lock.yaml
│
└── frontend/
├── src/
├── app/
├── components/
├── .env.example
├── package.json
└── app.json

---

## 🏁 Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/ChathuraJanithya/learning-app
cd learning-app


cd backend
pnpm install
```

### 2. Configure environment variables

MONGO_URI=<your_mongodb_connection_string>
SECRET_KEY=<your_jwt_secret_key>
OPENAI_API_KEY=<your_openai_api_key>
PORT=<your_local_port>

### 3. Run the server:

pnpm run dev

### 4. Frontend Setup

Open a new terminal, navigate to the frontend directory, install dependencies, and start the Expo development server.

bash
Copy
Edit
cd frontend
pnpm install
npx expo start
