### **Real-Time Coding Interview Platform**

#### **Introduction**

The **Real-Time Coding Interview Platform** is designed to simplify and improve the process of conducting technical interviews. It provides a **collaborative coding environment** where interviewers and candidates can interact in real time. This platform aims to make hiring more efficient, transparent, and fair by integrating features such as **live coding, video/audio conferencing, anti-cheating mechanisms, and automated evaluation tools**.

#### **Why This Platform?**

Traditional interview methods often require multiple tools, such as video calls, coding platforms, and manual note-taking. This leads to inefficiencies and difficulty in maintaining a structured hiring process. Our platform brings everything into one place, allowing interviewers to:

- Conduct interviews with **real-time code execution**.
- **Monitor candidates** with anti-cheating features.
- Use **custom evaluation forms** for structured assessments.
- **Record interviews** for later review.
- Automate tasks like **interview scheduling and result tracking**.

#### **Key Features**

1. **Live Coding Environment** – Candidates and interviewers can write, edit, and execute code in real time.
2. **Video & Audio Conferencing** – Integrated **WebRTC-based** video calls for seamless communication.
3. **Anti-Cheating Measures** – Tab-switch detection, session monitoring, and automated alerts.
4. **Custom Evaluation Forms** – Interviewers can create **reusable** assessment forms for structured feedback.
5. **Automated Result Management** – The system records scores and feedback, making hiring decisions easier.

#### **Technology Stack**

- **Frontend:** React.js (with Vite for optimization).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB for flexible data handling.
- **Real-Time Features:** WebRTC for video/audio, Monaco Editor for collaborative coding.
- **AI Integration:** Smart resume filtering and evaluation insights.

#### **Conclusion**

The platform helps companies and interviewers **save time, reduce manual effort, and improve hiring accuracy**. By providing a **fair and structured evaluation process**, it ensures that the best candidates are selected efficiently. Future improvements may include **LinkedIn job portal integration** and **advanced analytics** for better hiring decisions.

---

### **Database Schema - Real-Time Coding Interview Platform**

#### **Overview**

This database schema is designed for a **Real-Time Coding Interview Platform**. It structures data for managing interviewers, candidates, interviews, evaluation forms, feedback, and results.

---

### **Database Schema - Real-Time Coding Interview Platform**

### **Tables & Description**

### **1️⃣ Interviewer Table**

Stores interviewer details and authentication data.

- `interviewerId` (PK) – Unique identifier
- `name`, `email` (Unique), `company`, `position`
- `passwordHash` – Hashed password for authentication
- `accessToken`, `refreshToken`
- `role` (Admin/Interviewer)
- `createdAt`, `updatedAt`

### **2️⃣ Candidate Table**

Holds candidate information and login credentials.

- `candidateId` (PK) – Unique identifier
- `name`, `email` (Unique)
- `passwordHash` – Hashed password for authentication
- `accessToken`, `refreshToken`
- `resumeLink`, `appliedPosition`
- `createdAt`, `updatedAt`

### **3️⃣ Interview Table**

Manages interview sessions.

- `interviewId` (PK) – Unique identifier
- `interviewerId` (FK → Interviewer)
- `candidateId` (FK → Candidate)
- `evaluationFormId` (FK → Evaluation Form)
- `scheduledTime`, `status` (Pending, Completed, Rejected, Hired)
- `createdAt`, `updatedAt`

### **4️⃣ Evaluation Form Table** (Reusable Forms)

Stores templates for evaluating candidates.

- `evaluationFormId` (PK) – Unique identifier
- `interviewerId` (FK → Interviewer)
- `title`, `description`
- `createdAt`, `updatedAt`

### **5️⃣ Evaluation Response Table**

Stores feedback and scores for candidates.

- `responseId` (PK) – Unique identifier
- `interviewId` (FK → Interview)
- `evaluationFormId` (FK → Evaluation Form)
- `score`, `comments`
- `createdAt`, `updatedAt`

### **6️⃣ Result Table**

Stores final hiring decisions.

- `resultId` (PK) – Unique identifier
- `interviewId` (FK → Interview)
- `responseId` (FK → Evaluation Response)
- `finalDecision` (Hired/Rejected/On-Hold)
- `remarks`
- `createdAt`, `updatedAt`

---


### **Backend Repository - Real-Time Coding Interview Platform**  

#### **Project Overview**  
This is the backend for the **Real-Time Coding Interview Platform**, built using **Node.js, Express.js, and MongoDB**. It provides **authentication, interview management, real-time collaboration, and evaluation features** via a RESTful API.  

---

### **Backend Structure**  
```
backend/  
│── .gitignore  
│── package.json  
│── README.md  
│── public/  
│── src/  
│   ├── config/            # Database, JWT, email service  
│   ├── models/            # Mongoose models for database schema  
│   ├── controllers/       # Logic for handling API requests  
│   ├── routes/            # Express routes for APIs  
│   ├── middlewares/       # Authentication & error handling  
│   ├── utils/             # Helpers for validation & responses  
│   ├── app.js             # Express app setup  
│   ├── index.js           # Server entry point  
│── .env (ignored)         # Environment variables  
```

### **Setup & Installation**  
1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-repo.git
   cd backend
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Setup environment variables**  
   Create a `.env` file and add:  
   ```env
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   SMTP_USER=your_email
   SMTP_PASS=your_password
   ```

4. **Run the server**  
   ```bash
   npm start
   ```
   Server runs at: **http://localhost:5000**  


### **Available APIs**  
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| POST   | `/api/auth/register`      | Register user             |
| POST   | `/api/auth/login`         | Login user                |
| GET    | `/api/interviews`         | Get all interviews        |
| POST   | `/api/interviews`         | Create an interview       |
| GET    | `/api/candidates/:id`     | Get candidate details     |
| POST   | `/api/evaluations`        | Submit evaluation         |
| GET    | `/api/results/:id`        | Get interview results     |

---