import mongoose from 'mongoose';

/**
 * A Lead is a planned-care enquiry: medical tourism or home healthcare.
 * Phase 1 captures only what the landing page asks for; the Phase 2 intake
 * wizard extends the same document with the full medical requirement.
 */
const leadSchema = new mongoose.Schema(
  {
    journeyId: { type: String, required: true, unique: true, index: true },

    // What the visitor came for.
    intent: {
      type: String,
      required: true,
      enum: ['medical_tourism', 'home_healthcare', 'general_enquiry'],
      index: true,
    },
    treatment: { type: String, trim: true, maxlength: 120 },

    // Who is asking.
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    country: { type: String, trim: true, maxlength: 80 },
    preferredCity: { type: String, trim: true, maxlength: 80 },
    preferredLanguage: { type: String, trim: true, maxlength: 40 },

    urgency: {
      type: String,
      enum: ['emergency', 'within_48h', 'within_1_week', 'within_1_month', 'later', 'not_sure'],
      default: 'not_sure',
    },

    // Free-text description of the situation.
    message: { type: String, trim: true, maxlength: 4000 },

    consent: { type: Boolean, required: true },

    status: {
      type: String,
      enum: [
        'new',
        'contacted',
        'qualifying',
        'options_sent',
        'won',
        'lost',
        'spam',
        'New',
        'Contacted',
        'Qualified',
        'Converted',
        'Lost',
        'Deleted',
      ],
      default: 'New',
      index: true,
    },

    source: {
      page: { type: String, trim: true, maxlength: 200 },
      referrer: { type: String, trim: true, maxlength: 500 },
      utm: { type: Map, of: String },
    },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.models.Lead ?? mongoose.model('Lead', leadSchema);
