import express from 'express';
import Comment from '../models/Comment.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const comment = await Comment.create({
    ...req.body,
    author: req.user._id,
    createdAt: new Date()
  });
  res.status(201).json(comment);
});

router.get('/:id', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id });
  res.json(comments);
})

router.put('/:id', auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment.author.toString() !== req.user._id)
    return res.status(403).json({ message: 'Not your comment' });

  comment.text = req.body.text;
  await comment.save();
  res.json(comment);
});

router.delete('/:id', auth, async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (req.user.role !== 'admin' && comment.author.toString() !== req.user._id)
    return res.status(403).json({ message: 'Unauthorized' });

  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
});

export default router;

