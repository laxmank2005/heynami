# 💬 Real-Time Chat Application

A modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## ✨ Features

- 🔐 User Authentication (Register/Login/Logout)
- 💬 Real-time messaging with Socket.io
- 👥 Online/Offline user status
- 🔍 Search users
- 🖼️ Unique avatar for each user (DiceBear API)
- 📱 Responsive design for all devices
- 🎨 Clean and modern UI
- 🔄 Redux state management with persistence
- ⚡ Fast and optimized performance

## 🛠️ Tech Stack

### Frontend
- React 19
- Redux Toolkit & Redux Persist
- React Router v7
- Socket.io Client
- Axios
- Tailwind CSS & DaisyUI
- Vite
- React Hot Toast

### Backend
- Node.js & Express
- MongoDB & Mongoose
- Socket.io
- JWT Authentication
- bcryptjs
- Cookie Parser
- CORS

## 📁 Project Structure

```
chattingApp/
├── Backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── messageController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── isAuthenticated.js
│   ├── models/
│   │   ├── conversationModel.js
│   │   ├── messageModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   ├── socket/
│   │   └── socket.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Homepage.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── OtherUser.jsx
    │   │   ├── OtherUsers.jsx
    │   │   ├── MessageContainer.jsx
    │   │   ├── Messages.jsx
    │   │   ├── Message.jsx
    │   │   └── SendInput.jsx
    │   ├── config/
    │   │   └── api.js
    │   ├── hooks/
    │   │   ├── useGetMessages.jsx
    │   │   ├── useGetOtherUsers.jsx
    │   │   └── useGetRealTimeMessage.jsx
    │   ├── redux/
    │   │   ├── messageSlice.js
    │   │   ├── socketSlice.js
    │   │   ├── userSlice.js
    │   │   └── store.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env
    ├── .env.example
    ├── package.json
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd chattingApp
```

2. **Setup Backend**
```bash
cd Backend
npm install
```

Create `.env` file in Backend folder:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Setup Frontend**
```bash
cd Frontend
npm install
```

Create `.env` file in Frontend folder:
```env
VITE_API_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080
```

### Running the Application

1. **Start Backend Server**
```bash
cd Backend
npm run dev
```
Backend will run on http://localhost:8080

2. **Start Frontend**
```bash
cd Frontend
npm run dev
```
Frontend will run on http://localhost:5173

3. **Open your browser** and go to http://localhost:5173

## 🎯 Usage

1. **Register**: Create a new account with username, password, and gender
2. **Login**: Sign in with your credentials
3. **Chat**: Select a user from the sidebar to start chatting
4. **Real-time**: Messages appear instantly for both users
5. **Search**: Use the search bar to find specific users
6. **Logout**: Click the logout button in the sidebar

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**
- Backend: Render, Railway, Heroku
- Frontend: Vercel, Netlify
- Database: MongoDB Atlas

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- HTTP-only cookies
- CORS protection
- Environment variables for sensitive data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Built with ❤️ by [Your Name]

## 🙏 Acknowledgments

- DiceBear for avatar API
- Socket.io for real-time communication
- MongoDB Atlas for database hosting

## 📧 Contact

For any queries or suggestions, feel free to reach out!

---

**Happy Chatting! 💬**
