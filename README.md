# 🌿 AgroWaste Portal

An AI-powered mobile application that connects farmers with industries by enabling them to sell agricultural waste directly.  
Built with **React Native (Expo CLI)** for the frontend and **Node.js + Express** for the backend.  
The app supports **multilingual interfaces**, **text-to-speech accessibility**, **real-time price negotiation**, and a built-in **Gemini chatbot** for agro-waste guidance.

---

## 📁 Project Structure

```
agrowaste-portal/
├── frontend/          # React Native app (Expo CLI)
└── backend/           # Node.js + Express server
```

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v16+)
- Expo CLI (`npm install -g expo-cli`)
- MongoDB (Atlas or local)
- Cloudinary Account (for image storage)

---

### 🖥️ Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file and add:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the server:

   ```bash
   nodemon server.js
   ```

---

### 📱 Frontend Setup (Expo React Native)

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Expo development server:

   ```bash
   expo start
   ```

4. Scan the QR code using the Expo Go app (Android/iOS) to view the app.

---

## 🔑 Features

- 🧑‍🌾 **Waste Listings** – Farmers post waste details with price and images
- 💬 **Live Price Negotiation** – Real-time chat using Socket.IO
- 🤖 **AI Chatbot** – Gemini API provides advice and tutorials
- 🌐 **Multilingual UI** – Supports Hindi, Marathi, Telugu, and more
- 🔊 **Text-to-Speech** – Content is read aloud for accessibility
- 🎥 **Tutorials** – Step-by-step explainer videos in multiple languages
- ☁️ **Image Upload** – Secure storage with Cloudinary
- 🔐 **JWT Authentication** – Role-based access for farmers and buyers

---

## 🛠️ Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| Frontend     | React Native (Expo), Tailwind (NativeWind) |
| Backend      | Node.js, Express.js                        |
| Database     | MongoDB + Mongoose                         |
| Real-Time    | Socket.IO                                  |
| Image CDN    | Cloudinary                                 |
| AI Chatbot   | Gemini API                                 |
| Auth         | JWT Tokens                                 |
| TTS          | react-native-tts                           |
| Localization | i18next + AsyncStorage                     |

---

## 📷 Screenshots

Demo video is provided above.

---

## ✨ Future Improvements

- Add in-app push notifications
- Integrate voice input (speech-to-text)
- Admin dashboard for platform monitoring
- Offline support with local database

---
