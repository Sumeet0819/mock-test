# MockTest Platform 🧠

An open-source full-stack mock test web application. Admins upload JSON tests; users take them without signing up.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + Redux Toolkit + Axios
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Auth**: JWT + bcrypt

---

## Prerequisites
- Node.js ≥ 18
- MongoDB running locally on `mongodb://localhost:27017`

---

## Setup

### 1. Clone & Navigate
```bash
git clone <repo-url> mock-test
cd mock-test
```

### 2. Backend
```bash
cd backend
npm install
# Seed default admin account
npm run seed
# Start server (port 5000)
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev          # Opens http://localhost:5173
```

---

## Default Admin Credentials
```
Email:    admin@mock.test
Password: Admin@123
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/user` | — | Register user by name, get JWT |
| POST | `/admin/login` | — | Admin login |
| POST | `/admin/test` | Admin JWT | Upload test JSON |
| GET | `/admin/tests` | Admin JWT | List all tests |
| DELETE | `/admin/test/:id` | Admin JWT | Delete a test |
| GET | `/test/all` | — | Get all tests (public) |
| GET | `/test/:id` | — | Get test (no answers) |
| POST | `/test/submit` | — | Submit answers, get score |

---

## Test JSON Format
```json
{
  "title": "JavaScript Basics",
  "duration": 30,
  "questions": [
    {
      "question": "What is closure?",
      "options": ["A func inside a func", "A loop", "An object", "A class"],
      "correctAnswer": "A func inside a func"
    }
  ]
}
```

---

## Project Structure
```
mock-test/
├── backend/
│   ├── controllers/    (adminController.js, userController.js)
│   ├── middleware/     (auth.js)
│   ├── models/        (Admin.js, Test.js, UserAttempt.js)
│   ├── routes/        (admin.js, user.js)
│   ├── scripts/       (seed.js)
│   ├── .env
│   └── server.js
└── frontend/
    └── src/
        ├── lib/       (axios.js)
        ├── pages/     (Landing, TestPage, ResultPage, admin/*)
        └── redux/     (store.js, slices/*)
```

---

## License
MIT
