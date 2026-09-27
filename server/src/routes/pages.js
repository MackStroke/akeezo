const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');

// Get all pages (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const pages = await Page.find().sort('-createdAt');
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single page by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a page
router.post('/', protect, async (req, res) => {
  try {
    const page = new Page(req.body);
    await page.save();
    res.status(201).json(page);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A page with this slug already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Update a page
router.put('/:id', protect, async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A page with this slug already exists.' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete a page
router.delete('/:id', protect, async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json({ message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
