import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String },
  excerpt: { type: String },
  content: { type: String },
  coverImage: { type: String },
  author: { type: String },
  authorRole: { type: String },
  authorAvatar: { type: String },
  date: { type: String },
  readTime: { type: String },
  views: { type: Number, default: 0 },
  status: { type: String, default: 'Published' },
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Blog = mongoose.model('Blog', BlogSchema);

