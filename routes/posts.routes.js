import express from 'express';
import Post from '../models/Post.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const post = await Post.create({ ...req.body, author: req.user._id, createdAt: new Date() });
  res.status(201).json(post);
});

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');
  res.json(post);
});

router.put('/:id', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  
  // Check if user is post author or admin
  if (post.author.toString() !== req.user._id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to update this post' });
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true }
  ).populate('author', 'username');
  
  res.json(updatedPost);
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: 'Post deleted' });
});

export default router;
