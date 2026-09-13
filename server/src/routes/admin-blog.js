import { Router } from 'express';
import { Blog } from '../models/Blog.js';

const router = Router();

// Get all blog posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 }).lean();
    res.json({ ok: true, data: posts });
  } catch (err) {
    next(err);
  }
});

// Create or update a blog post
router.post('/', async (req, res, next) => {
  try {
    const { _id, id, title, ...rest } = req.body;
    let slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Check if updating
    let post;
    const searchId = _id || id;
    if (searchId && searchId.length === 24) { // typical mongo ObjectId length
      post = await Blog.findById(searchId);
    } else if (searchId && searchId.startsWith('post_')) { // Legacy id support
      post = await Blog.findOne({ id: searchId }); // fallback
    }

    if (!post) {
      // Create new
      const newPost = new Blog({ title, slug, ...rest });
      await newPost.save();
      return res.json({ ok: true, data: newPost });
    } else {
      // Update existing
      post.title = title;
      if (req.body.slug) post.slug = req.body.slug;
      Object.assign(post, rest);
      await post.save();
      return res.json({ ok: true, data: post });
    }
  } catch (err) {
    next(err);
  }
});

// Delete a blog post
router.delete('/:id', async (req, res, next) => {
  try {
    const searchId = req.params.id;
    let result;
    if (searchId.length === 24) {
      result = await Blog.findByIdAndDelete(searchId);
    } else {
      result = await Blog.findOneAndDelete({ slug: searchId }); // fallback to slug
    }
    
    if (!result) return res.status(404).json({ error: 'Post not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Toggle status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const searchId = req.params.id;
    const post = await Blog.findById(searchId);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    post.status = post.status === 'Published' ? 'Draft' : 'Published';
    await post.save();
    res.json({ ok: true, data: post });
  } catch (err) {
    next(err);
  }
});

export default router;
