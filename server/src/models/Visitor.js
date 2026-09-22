import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., 'page_view', 'form_open', 'form_submit'
  path: { type: String, required: true }, // e.g., '/', '/hospitals', '/blog'
  section: { type: String }, // e.g., 'hero', 'contact_form'
  details: { type: mongoose.Schema.Types.Mixed }, // any extra data
  timestamp: { type: Date, default: Date.now }
});

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true },
  ip: { type: String },
  userAgent: { type: String },
  country: { type: String },
  events: [eventSchema],
  sessionCount: { type: Number, default: 1 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

export const Visitor = mongoose.models.Visitor || mongoose.model('Visitor', visitorSchema);
