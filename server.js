import authRoutes from './routes/auth.routes.js';
import commentRoutes from './routes/comments.routes.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'express';
import mongoose from 'mongoose';
import postRoutes from './routes/posts.routes.js';
import userRoutes from './routes/users.routes.js';

dotenv.config();

const app = express();
// app.use(cors());
// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.header("Origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error(err));