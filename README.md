# DecodeLabs Project 4 - Frontend & Backend Integration

Full Stack Development Industrial Training Kit - Batch 2026.

## Project Objective

Integrate the frontend with the existing Express + SQLite backend API and demonstrate a complete full-stack data flow.

## Features

- REST API integration using the browser Fetch API
- Async JavaScript with async/await
- Dynamic student list from SQLite
- Create student
- Read students
- Update student
- Delete student
- Loading state
- Success and error messages
- HTTP response validation with `response.ok`
- Responsive student management UI
- Same-origin frontend/backend integration

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- SQLite / sqlite3
- REST API
- Fetch API

## Project Structure

```text
decodelabs-project-4-complete/
├── backend/
│   ├── controllers/userController.js
│   ├── middleware/validation.js
│   ├── routes/users.js
│   └── server.js
├── database/
│   └── database.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## API Endpoints

| Operation | Method | Endpoint |
|---|---|---|
| Health | GET | `/api/health` |
| Read All | GET | `/api/students` |
| Read One | GET | `/api/students/:id` |
| Create | POST | `/api/students` |
| Update | PUT | `/api/students/:id` |
| Delete | DELETE | `/api/students/:id` |

## How to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the server

```bash
npm start
```

### 3. Open the application

```text
http://localhost:3000
```

The SQLite database and `students` table are created automatically on first run.

## Full-Stack Data Flow

```text
Frontend UI
   ↓
Fetch API
   ↓
Express REST API
   ↓
Controller
   ↓
SQLite Database
   ↓
JSON Response
   ↓
JavaScript
   ↓
Dynamic DOM Update
```

## Project 4 Concepts Demonstrated

- Frontend and backend integration
- RESTful HTTP methods
- Asynchronous requests
- `fetch()` API
- `async/await`
- JSON parsing
- HTTP status handling
- Error handling with `try/catch/finally`
- Dynamic DOM rendering
- Defensive programming

## Developer

Sakshi Birajdar

Full Stack Development Trainee - DecodeLabs Batch 2026
