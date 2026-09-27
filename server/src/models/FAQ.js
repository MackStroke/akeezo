import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true, default: 'General' },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' }
}, {
  timestamps: true
});

export const FAQ = mongoose.model('FAQ', FAQSchema);
