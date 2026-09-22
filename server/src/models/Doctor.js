import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    experienceYears: { type: Number, min: 0 },
    languages: [{ type: String, trim: true }],
    image: { type: String },
    location: { type: String, trim: true },
    hospital: { type: String, trim: true }, // or ObjectId ref
    consultationType: [{ type: String, enum: ['online', 'offline'] }],
    fee: { type: Number, min: 0 },
    available: { type: Boolean, default: true },
    about: { type: String, trim: true }
  },
  { timestamps: true }
);

export const Doctor = mongoose.models.Doctor ?? mongoose.model('Doctor', doctorSchema);
