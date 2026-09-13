import { Router } from 'express';
import { Blog } from '../models/Blog.js';

const router = Router();

// Public: get all published posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Blog.find({ status: 'Published' }).sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: posts });
  } catch (err) {
    next(err);
  }
});

// Public: get single post by slug
router.get('/:slug', async (req, res, next) => {
  try {
    // Increment view count concurrently
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, status: 'Published' },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
});

export default router;
