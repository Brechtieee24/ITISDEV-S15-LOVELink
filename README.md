# ITISDEV-S15-LOVELink

# 💖 LOVELink

A web application designed to manage user participation, track residency hours, and enable photo uploads with QR code support. Built with Node.js, Express, MongoDB, and Handlebars.

---

## 🚀 Features

- 🔐 Google OAuth2 Authentication (Passport.js)
- 🕒 Persistent Residency Time Tracking (even after logout)
- 📸 Photo Upload with Cloudinary Integration
- 📄 Dynamic Views using Handlebars (`express-handlebars`, `hbs`)
- 📦 Modular MVC Architecture
- 📊 QR Code Generation for User Check-ins
- 🎨 Custom Animations (CSS & JS)
- 🗂️ Session Management with `express-session`

---

## 🗂️ Project Structure
```
   LOVELink/
   ├── config/ # Configuration files (DB, passport, etc.)
   ├── model/ # Controllers and Mongoose schema
   ├── public/ # Static assets (images, CSS, JS)
   │ ├── css/
   │ ├── js/
   │ └── Images/
   ├── routes/ # Route handlers (Express)
   ├── views/ # Handlebars templates (pages, partials, layout)
   ├── .env # Environment variables
   ├── .gitignore # Git ignore rules
   ├── app.js # Entry point
   ├── package.json # Project metadata and scripts
   └── package-lock.json # Dependency lock file
```
## ⚙️ Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/LOVELink.git
   cd LOVELink

2. Install Dependencies
   ```bash
    npm install

3. Set Up Environment Variables
Create a .env file in the root directory and add:
    DB_URI
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET
    GOOGLE_CALLBACK_URL
    SESSION_SECRET=your_session_secret
    CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET

4. Run the App
- For Production:
   ```bash
  npm start

- For Development:
  ```bash
    npm run dev

5. Open in Browser
Visit: http://localhost:3000

## 📦 Dependencies
Installable via:
  ```bash
  npm install body-parser cloudinary dotenv express express-handlebars express-session hbs mongoose multer multer-storage-cloudinary passport passport-google-oauth20 qrcode
  ```

| Dependency                | Version | Purpose                              |
| ------------------------- | ------- | ------------------------------------ |
| body-parser               | ^2.2.0  | Parses incoming request bodies       |
| cloudinary                | ^1.41.3 | Media upload & storage               |
| dotenv                    | ^17.2.1 | Load environment variables           |
| express                   | ^5.1.0  | Web server framework                 |
| express-handlebars        | ^8.0.1  | Handlebars templating for Express    |
| express-session           | ^1.18.1 | Session management                   |
| hbs                       | ^4.2.0  | Handlebars view engine for Express   |
| mongoose                  | ^8.16.3 | MongoDB object modeling              |
| multer                    | ^2.0.2  | File upload middleware               |
| multer-storage-cloudinary | ^4.0.0  | Multer storage engine for Cloudinary |
| passport                  | ^0.7.0  | Authentication middleware            |
| passport-google-oauth20   | ^2.0.0  | Google OAuth2 strategy for Passport  |
| qrcode                    | ^1.5.4  | QR code generation                   |

## 👥 Author
Albrecht Gabriel Abad, Hana Jang, Josh Denzel Ng, Cedric Clifford Ong, Maverick Olivares

