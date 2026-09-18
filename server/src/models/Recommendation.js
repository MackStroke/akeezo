import mongoose from 'mongoose';

/**
 * A Recommendation is a visitor suggestion for a new city or country hub.
 */
const recommendationSchema = new mongoose.Schema(
  {
    recommendationId: { type: String, required: true, unique: true, index: true },

    type: {
      type: String,
      required: true,
      enum: ['city', 'country'],
      default: 'city',
      index: true,
    },

    // City or Country name suggested by user
    targetName: { type: String, required: true, trim: true, maxlength: 120 },

    // State / Region / Speciality context if applicable
    region: { type: String, trim: true, maxlength: 120 },

    // Who recommended
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 32 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },

    // Optional reason or description
    reason: { type: String, trim: true, maxlength: 2000 },

    status: {
      type: String,
      enum: ['new', 'reviewed', 'planned', 'archived'],
      default: 'new',
      index: true,
    },

    adminNotes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

recommendationSchema.index({ createdAt: -1 });

export const Recommendation =
  mongoose.models.Recommendation ?? mongoose.model('Recommendation', recommendationSchema);
