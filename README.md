# 🚀 Full Stack Portfolio Backend

A production-ready, highly secure, and optimized Node.js backend for managing a multi-frontend portfolio ecosystem. Built with Express, MongoDB, and Cloudinary.

## 🛠️ Tech Stack
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **File Storage**: Cloudinary
- **Real-time**: Socket.io
- **Documentation**: Swagger (OpenAPI 3.0)
- **Security**: Helmet, XSS-Clean, MongoSanitize, Rate-Limiting
- **Deployment**: Render

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js installed
- MongoDB Atlas account
- Cloudinary account

### 2. Installation
```bash
git clone <your-repo-url>
cd backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the root and fill in the following:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
ALLOWED_ORIGINS=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Running the App
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

---

## 📖 API Documentation
Once the server is running, visit:
- **Swagger Docs**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/api/v1/health`

---

## 🚀 Deployment (Render)
1. Push your code to GitHub.
2. Link your repository to **Render.com**.
3. Render will automatically detect the `render.yaml` configuration.
4. Manually add the secrets (`MONGO_URI`, `CLOUDINARY_API_SECRET`, etc.) in the Render Dashboard under **Environment**.

---

## 🔐 Security Features
- **Helmet**: Secure HTTP headers.
- **Rate Limiting**: Protection against brute-force/DoS.
- **XSS Clean**: Sanitizes user input to prevent scripting attacks.
- **Mongo Sanitize**: Prevents NoSQL query injection.
- **CORS**: Domain whitelisting.

---

## 📦 API Usage Examples

### 1. Fetching Theme for a Portfolio
**GET** `/api/v1/themes/portfolio-v1`
```json
{
  "success": true,
  "data": {
    "colors": { "primary": "#3b82f6", ... },
    "fonts": { "heading": "Inter, sans-serif" }
  }
}
```

### 2. Uploading an Achievement (with Photos)
**POST** `/api/v1/achievements` (Multipart/Form-Data)
- `title`: "AWS Certified Developer"
- `achievementDate`: "2024-05-01"
- `photos`: [File 1, File 2]
- `frontends`: ["portfolio-v1"]

### 3. Real-time Listeners (Socket.io)
```javascript
const socket = io('your-backend-url');
socket.emit('join-frontend', 'portfolio-v1');

socket.on('theme:update', (newTheme) => {
  console.log('Theme updated in real-time!', newTheme);
});
```

---

## 🤝 Modules Overview
- **Frontends**: Manage multiple portfolio metadata.
- **Projects**: Showcase projects with screenshots and tech stacks.
- **Internships**: Work experience with certificate uploads.
- **Skills**: Technical proficiencies categorized by level.
- **Achievements**: Awards with automated Gallery integration.
- **Research & Patents**: Academic and intellectual property tracking.
- **Themes**: Dynamic design tokens (colors, fonts, spacing).
- **Layout**: Header and Footer management.
- **Hero**: Dynamic landing page configuration.

---

## 📄 License
MIT © Nandakishore
