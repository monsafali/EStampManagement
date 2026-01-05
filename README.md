# 🏷️ E-Stamp Management System

A **full-stack MERN (MongoDB, Express.js, React.js, Node.js)** application designed for managing **e-stamp vendors, administrators, and end-to-end e-stamp issuance workflows**. The system is built with **security, scalability, and intelligence** in mind, integrating modern authentication, payments, AI-powered features, and real-time communication.

---

## 🚀 Key Features

### 🔐 Authentication & Authorization

- Role-based access control (**Admin, Vendor, User, Bank**)
- JWT-based authentication
- Google OAuth 2.0 login
- Secure **Email + OTP onboarding**
- Session persistence & protected routes

### 🏢 Vendor & Admin Management

- Vendor registration & verification
- Admin approval workflows
- Vendor profile management
- Cloudinary-based image uploads (CNIC, documents, profile images)

### 💳 Payments & Billing

- **Stripe payment gateway** integration
- Secure e-stamp purchase flow
- Payment verification & transaction logs
- Automated invoice generation (optional extension)

### 🤖 AI-Powered Intelligence (RAG)

- Retrieval-Augmented Generation (**RAG**) module
- Intelligent pricing suggestions
- AI-powered query handling
- SQLite-based document chunk storage
- OpenAI API integration

### 💬 Real-Time Communication

- Real-time chat system using **Socket.IO**
- Admin ↔ Vendor messaging
- AI-assisted chat responses (OpenAI)

### 📊 Analytics & Dashboards

- Interactive admin dashboards
- Graph-based analytics (sales, vendors, usage)
- Real-time system insights
- Role-specific dashboards

### 🌍 Location & Automation

- Geolocation APIs for location detection
- Automated **cron jobs** for:

  - Expired stamp cleanup
  - Scheduled reports
  - Data maintenance tasks

---

## 🧱 Tech Stack

### Frontend

- React.js
- Tailwind CSS / CSS Modules
- Axios
- Chart libraries (Recharts / Chart.js)
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- SQLite (for RAG document storage)
- JWT & Passport.js
- Nodemailer (Email OTP)
- Stripe SDK
- Cloudinary SDK
- Socket.IO
- Node-cron

### AI & Automation

- OpenAI API
- LangChain (RAG flow)
- Vectorized document chunks

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
OPENAI_API_KEY=your_openai_key
JWT_TIMEOUT=
JWT_EXPIRES='7d'
COOKIE_EXPIRE=7
SUPER_ADMIN_NAME=you admin name
SUPER_ADMIN_USERNAME=you admin email
SUPER_ADMIN_PASSWORD=your admin password
SUPER_ADMIN_EMAIL=your admin email
```

Create a `.env` file in the `frontend` directory:
VITE_GOOGLE_CLIENT_ID=your google client id
VITE_LOCATION_API=location api

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/e-stamp-management-system.git
cd e-stamp-management-system
```

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔄 API Highlights

- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/verifyotp`
- `POST /api/vendor/register`
- `POST /api/payment/stripe`
- `GET /api/analytics/dashboard`
- `POST /api/chat/message`
- `POST /api/rag/query`

---

## 🔐 Security Measures

- Encrypted JWT tokens
- Role-based middleware protection
- Secure payment handling via Stripe
- OTP-based verification
- Environment-based secrets

---

## 🌱 Future Enhancements

- Blockchain-backed stamp verification
- Mobile app (React Native)
- Advanced AI fraud detection

---

## 👨‍💻 Author

**Monsaf Ali**
Professional Full-Stack MERN Developer
Specialized in **AI-integrated SaaS, Automation, and Secure Web Systems**
