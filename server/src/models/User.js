import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'USR-' + Math.floor(100000 + Math.random() * 900000)
  },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  nationality: { type: String },
  preferredLanguage: { type: String },
  emergencyContact: { type: String },
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'banned'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const User = mongoose.model('User', UserSchema);

