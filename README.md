# My Shangri-La Referendum (MSLR) Voting System

A complete referendum voting system with React frontend, Node.js/Express backend, and MySQL database.

## 🎯 Features

### Voter Features
- **Registration**: Register using SCC code (manual entry or QR code scan/upload)
- **Authentication**: Secure JWT-based login
- **Voting**: Cast vote on open referendums (one vote per referendum)
- **Dashboard**: View all referendums with status badges (Open/Closed/Voted)
- **Results**: View closed referendum results with charts
- **Profile**: View personal information

### Admin (Election Commission) Features
- **Dashboard**: View statistics (total referendums, open/closed, total votes)
- **Create Referendum**: Create new referendums with custom options
- **Edit Referendum**: Edit referendums that haven't received votes yet
- **Manage Status**: Open/close referendums manually
- **View Results**: View detailed voting results with charts
- **Auto-Close**: Referendums auto-close when 50% of voters vote for one option

### API Features
- **Open Data API**: Public REST API for referendum data (no authentication required)
- **Authenticated API**: Protected routes for voters and admins
- **Role-Based Access**: JWT with role-based authorization (VOTER/EC)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- MySQL Workbench (recommended)

### Step 1: Database Setup

1. Open MySQL Workbench
2. Create a new connection to your MySQL server
3. Execute the database schema:

```sql
-- Navigate to backend/database/schema.sql and execute it
-- Or run directly in MySQL:
source /path/to/backend/database/svv3.sql;
```

The schema will:
- Create database `suryadb`
- Create all required tables (users, scc_codes, referendum, referendum_options, voter_history)
- Insert admin user (email: ec@referendum.gov.sr, password: Shangrilavote&2025@)
- Insert 20 SCC codes
- Insert 2 sample referendums

### Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Edit `backend/.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=suryadb
JWT_SECRET=mslr_secret_key_2025_shangri_la_referendum_system
JWT_EXPIRE=7d
```

4. Start backend server:
```bash
npm start
```

Backend will run on http://localhost:5000

### Step 3: Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000


## 🔌 API Endpoints

### Open Data API (No Auth Required)
- `GET /mslr/referendums?status=open|closed` - Get referendums by status (JSON format per specs)
- `GET /mslr/referendum/:id` - Get single referendum (JSON format per specs)
- `GET /health` - Health check


## 📦 Project Structure

```
mslr-voting-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── referendumController.js
│   │   ├── adminController.js
│   │   └── openDataController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── referendumRoutes.js
│   │   ├── adminRoutes.js
│   │   └── openDataRoutes.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── VoterLogin.jsx
│   │   │   ├── VoterRegister.jsx
│   │   │   ├── VoterDashboard.jsx
│   │   │   ├── VoterReferendums.jsx
│   │   │   ├── VoterReferendumDetail.jsx
│   │   │   ├── VoterResults.jsx
│   │   │   ├── VoterProfile.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminReferendums.jsx
│   │   │   ├── AdminCreateReferendum.jsx
│   │   │   ├── AdminEditReferendum.jsx
│   │   │   ├── AdminResults.jsx
│   │   │   └── AdminProfile.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
|__Screenshots
|__svv3.sql
└── README.md
```

# MSLR Login Credentials

## Admin Access

**Login URL:** http://localhost:3000/admin/login

**Credentials (as per coursework requirements):**
- Email: `ec@referendum.gov.sr`
- Password: `Shangrilavote&2025@`
