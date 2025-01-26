# QuestSearch

Welcome to the QuestSearch repository! This project is a web application for searching questions, including MCQ, Anagram, and Read Along types.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Search Questions**: Search for questions by title or content.
- **Filter by Type**: Filter questions by type (e.g., MCQ, Anagram, Read Along).
- **Anagram Support**: Rearrange letters or words to form correct answers.
- **Pagination**: Browse search results with pagination.

---

## Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas for remote database)
- [Git](https://git-scm.com/)

---

## Setup
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/QuestSearch.git
   cd QuestSearch

## Install Dependencies:
2. **For the backend**:
   ```bash
   cd backend
   npm install

## Set Up Environment Variables:
3. **Create a .env file in the backend directory**:
   ```bash
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   PORT=3000

## Configuration
### Backend
- **MongoDB Connection**:
  - Update the `MONGO_URI` in the `.env` file to point to your MongoDB instance.
  - Example:
    ```env
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
    ```
  - Replace `<username>`, `<password>`, and `<dbname>` with your MongoDB credentials.

### Frontend
- **API Base URL**:
  - Update the `VITE_API_BASE_URL` in the `frontend/.env` file to point to your backend server.
  - Example:
    ```env
    VITE_API_BASE_URL=http://localhost:3000
    ```

---

## Running the Project
1. **Start the Backend**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Start the server:
     ```bash
     npm start
     ```
   - The backend will run on `http://localhost:3000`.

2. **Start the Frontend**:
   - Navigate to the `frontend` directory:
     ```bash
     cd frontend
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - The frontend will run on `http://localhost:5173`.

3. **Access the Application**:
   - Open your browser and visit `http://localhost:5173`.
