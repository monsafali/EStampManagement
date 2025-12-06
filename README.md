E-Stamp Vendor Management System

A complete MERN-stack powered system for managing e-stamp vendors, ADC admins, super admins, bank dashboards, vendor payments,JWT RBACK Login,  Google OAuth login, Cloudinary image upload, Stripe payments, email OTP login, and more.

This project provides a secure, scalable architecture for e-stamp issuance and vendor management workflows.




Backend Environment Variables

MONGO_URI=mongodb://localhost:27017/E_Stamp
PORT=5000

# JWT
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES=7d
COOKIE_EXPIRE=7
JWT_TIMEOUT=1h

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key

# Client URL
CLIENT_URL=http://localhost:5173

# Super Admin (auto-created at first run)
SUPER_ADMIN_NAME=Kamal
SUPER_ADMIN_USERNAME=kamal
SUPER_ADMIN_PASSWORD=your_superadmin_password
SUPER_ADMIN_EMAIL=your_email@example.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Backend Base URL
BACKEND_URL=http://localhost:5000

# Punjab Location APIs
DISTRICT_API=
TEHSIL_API=

# SMTP (Brevo)
SMTP_USER=your_smtp_user
SMTP_KEY=your_smtp_key
SENDER_EMAIL=your_sender_email

# OpenAI API
OPENAI_API_KEY=your_openai_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret




Frontend Environment Variables (.env)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# EStampManagement
