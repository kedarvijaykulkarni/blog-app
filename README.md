# Blog Application

A full-stack blog application built with React, TypeScript, Node.js, and MongoDB.

## Features

- User authentication (Register/Login)
- Create, read, update, and delete blog posts
- Comment system
- User profiles
- Password management
- Responsive Material-UI design

```plaintext
This README provides:
1. Clear installation instructions
2. Project structure overview
3. Available API endpoints
4. Technology stack details
5. Development and production setup guides
6. Prerequisites and requirements
7. Environment configuration details
 ```
 
## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd blog-app

### 2. Backend Setup
1. Install server dependencies:
```bash
npm install
 ```

2. Create a .env file in the root directory:
```plaintext
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb://localhost:27017/blog_app
PORT=5000
 ```

3. Start the server:
```bash
npm run dev
 ```

The server will run on http://localhost:5000

### 3. Frontend Setup
1. Navigate to the client directory:
```bash
cd client
 ```

2. Install client dependencies:
```bash
npm install
 ```

3. Start the development server:
```bash
npm run dev
 ```

The client will run on http://localhost:5173

## Project Structure
```plaintext
blog-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API configuration
│   │   └── App.tsx       # Main application component
│   └── package.json
├── models/                # MongoDB models
├── routes/               # Express routes
├── middleware/           # Express middleware
├── server.js            # Express server
└── package.json
```

## API Endpoints
### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
### Posts
- GET /api/posts - Get all posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create post
- PUT /api/posts/:id - Update post
- DELETE /api/posts/:id - Delete post
### Comments
- GET /api/comments/:id - Get post comments
- POST /api/comments - Create comment
- PUT /api/comments/:id - Update comment
- DELETE /api/comments/:id - Delete comment
### Users
- GET /api/users/me - Get current user
- PUT /api/users/change-password - Change password
## Technologies Used
### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios
### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
## Development
To run both frontend and backend in development mode:

1. Start the backend server:
```bash
npm run dev
 ```

2. In a separate terminal, start the frontend:
```bash
cd client
npm run dev
 ```

## Production Build
1. Build the frontend:
```bash
cd client
npm run build
 ```

2. Start the production server:
```bash
cd ..
npm start
 ```

