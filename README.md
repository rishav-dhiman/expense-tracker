# Expense Tracker

A sleek, modern, and highly responsive Expense Tracker built with the MERN stack (MongoDB, Express, React, Node.js) and Tailwind CSS. This application allows users to effortlessly manage their finances, track incomes, expenses, investments, and savings, all through a secure, authenticated, and aesthetically pleasing interface.

## 🚀 Features

*   **Complete Financial Dashboard:** A centralized overview of your net balance, total income, expenses, investments, and savings.
*   **Dynamic Data Filtering:** Custom-built year dropdown filtering that updates the entire dashboard metrics in real-time using optimized React bindings (`useMemo`), without redundant API calls.
*   **Month-over-Month Trends:** Automatic calculation logic to show proportional percentage increases or decreases compared to the previous month.
*   **Category visualizers:** Custom visual mappings for transaction categories utilizing `lucide-react` iconography.
*   **Secure Authentication:** Full JWT-based login and signup flow with Bcrypt password hashing.
*   **Premium Minimalist UI:** Styled meticulously with Tailwind CSS, utilizing clean white backgrounds, pill-shaped borders, subtle drop shadows, and zero native-browser dropdowns. Includes a sleek slide-out profile menu.
*   **CRUD Operations:** Full ability to Add, View, and Delete incomes, expenses, investments, and savings.

## 💻 Technologies Used

*   **Frontend:** React (Vite), React Router Dom, Tailwind CSS, Lucide React (Icons), Axios.
*   **Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcryptjs, Cors.

## 🛠️ Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   Node.js (v16 or higher)
*   MongoDB Atlas Account (or local MongoDB installed)
*   Git

### 1. Clone the Repository

```bash
git clone https://github.com/rishav-dhiman/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

Open a new terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` directory based on the provided `.env.example` file:

```bash
cp .env.example .env
```

Open the new `.env` file and fill in your MongoDB connection string and a secret key for JWT:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secret_jwt_string_here
JWT_EXPIRE=30d
```

**Start the Backend Server:**

```bash
npm run dev
```

The server should now be running on `http://localhost:5000`.

### 3. Frontend Setup

Open another terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

**Start the Frontend Development Server:**

```bash
npm run dev
```

The application should now be live at `http://localhost:5173`.

## 📂 Project Structure

```text
expense-tracker/
├── backend/            # Express REST API, Mongoose Models, Controllers, Auth Logic
│   ├── config/         # Database connection
│   ├── controllers/    # Route controllers (auth, incomes, expenses, etc.)
│   ├── middleware/     # JWT verification middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   └── server.js       # Main server entry point
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI components (Topbar, RecentCategories, etc.)
    │   ├── context/    # React Context API for state management (Auth Context)
    │   ├── pages/      # Full views (Dashboard, Incomes, Login, etc.)
    │   ├── utils/      # Axios API interceptors
    │   ├── App.jsx     # App routing logic
    │   └── main.jsx    # React DOM entry
    ├── index.html
    ├── package.json
    └── tailwind.config.js
```

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
