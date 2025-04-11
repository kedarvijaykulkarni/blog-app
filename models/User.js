import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

export default mongoose.model('User', userSchema);
