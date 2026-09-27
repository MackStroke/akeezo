import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: { type: String, default: '' },
  included: { type: Boolean, default: true },
  additionalCharges: { type: String, default: '' }
}, { _id: true });

const packageSchema = new mongoose.Schema({
  planId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  monthlyPrice: { type: Number, required: true },
  yearlyPrice: { type: Number, required: true },
  yearlyDiscount: { type: Number, default: 0 },
  color: { type: String, default: '#4A90E2' },
  lightColor: { type: String, default: '#E8F4FD' },
  keyFeatures: [{ type: String }],
  popularServices: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isRecommended: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  allServices: [serviceSchema]
}, {
  timestamps: true,
  collection: 'packages'
});

export const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);
