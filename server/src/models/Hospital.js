import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    specialty: { type: String, required: true, trim: true },
    designation: { type: String, trim: true, maxlength: 120 },
    experienceYears: { type: Number, min: 0 },
    languages: [{ type: String, trim: true }],
  },
  { _id: false },
);

const treatmentEstimateSchema = new mongoose.Schema(
  {
    treatmentId: { type: String, required: true },
    treatmentLabel: { type: String, required: true },
    procedure: { type: String, trim: true },
    costRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    stayDays: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
  },
  { _id: false },
);

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    address: { type: String, trim: true, maxlength: 500 },

    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }, // [lng, lat]
    },

    nearestAirport: {
      name: { type: String, trim: true },
      code: { type: String, trim: true, maxlength: 10 },
      distanceKm: { type: Number, min: 0 },
    },

    specialties: [{ type: String, trim: true }],
    accreditations: [{ type: String, trim: true }],
    centersOfExcellence: [{ type: String, trim: true }],

    doctors: [doctorSchema],

    amenities: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    stayLogistics: [{ type: String, trim: true }],
    experienceTier: {
      type: String,
      enum: ['best_value', 'best_medical', 'premium'],
      default: 'best_value',
    },

    treatmentEstimates: [treatmentEstimateSchema],

    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, trim: true },
        category: { type: String, trim: true },
      },
    ],

    description: { type: String, trim: true, maxlength: 2000 },
    partnerTier: {
      type: String,
      enum: ['platinum', 'gold', 'silver'],
      default: 'silver',
    },
    isActive: { type: Boolean, default: true },
    isSample: { type: Boolean, default: false },
  },
  { timestamps: true },
);

hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ city: 1, specialties: 1 });
hospitalSchema.index({ specialties: 1 });
hospitalSchema.index({ accreditations: 1 });
hospitalSchema.index(
  { name: 'text', city: 'text', specialties: 'text' },
  { weights: { name: 10, city: 5, specialties: 3 } },
);

export const Hospital =
  mongoose.models.Hospital ?? mongoose.model('Hospital', hospitalSchema);
