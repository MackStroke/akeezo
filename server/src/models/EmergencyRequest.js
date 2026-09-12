import mongoose from 'mongoose';

/**
 * An EmergencyRequest is deliberately thin: the emergency journey must never
 * ask an ambulance-needing caller for more than the minimum. Triage detail is
 * added by the Emergency Control Desk (Phase 3), not by the caller.
 */
const emergencySchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true, index: true },

    // Step 1 — where.
    location: {
      label: { type: String, trim: true, maxlength: 300 },
      placeType: {
        type: String,
        enum: ['home', 'hotel', 'airport', 'railway_station', 'office', 'road', 'other'],
        default: 'other',
      },
      coordinates: {
        // [lng, lat] — GeoJSON order.
        type: [Number],
        validate: {
          validator: (v) => v.length === 0 || v.length === 2,
          message: 'coordinates must be [longitude, latitude]',
        },
        default: undefined,
      },
      accuracyMetres: Number,
    },

    // Step 2 — what happened.
    problem: { type: String, required: true, trim: true, maxlength: 120 },
    conscious: { type: String, enum: ['yes', 'no', 'not_sure'], default: 'not_sure' },
    breathingNormally: { type: String, enum: ['yes', 'no', 'not_sure'], default: 'not_sure' },

    // Step 3 — what help.
    helpNeeded: {
      type: [String],
      default: ['not_sure'],
    },

    // Step 4 — who is calling.
    requesterName: { type: String, required: true, trim: true, maxlength: 120 },
    requesterPhone: { type: String, required: true, trim: true, maxlength: 32 },
    patientName: { type: String, trim: true, maxlength: 120 },
    relationship: { type: String, trim: true, maxlength: 60 },

    requesterType: {
      type: String,
      enum: ['patient', 'family', 'hotel', 'airport', 'company', 'school', 'travel_agent', 'embassy', 'hospital', 'insurer', 'other'],
      default: 'family',
    },

    status: {
      type: String,
      enum: [
        'received',
        'desk_contacted',
        'response_assigned',
        'en_route',
        'hospital_identified',
        'patient_arrived',
        'handover_complete',
        'closed',
        'cancelled',
      ],
      default: 'received',
      index: true,
    },

    // Append-only audit trail. Emergency cases must be reconstructable.
    timeline: [
      {
        _id: false,
        at: { type: Date, default: Date.now },
        status: String,
        note: { type: String, maxlength: 1000 },
        actor: { type: String, maxlength: 120 },
      },
    ],
  },
  { timestamps: true },
);

// Emergency desk reads newest-first, and geo queries find the nearest units.
emergencySchema.index({ createdAt: -1 });
emergencySchema.index({ 'location.coordinates': '2dsphere' }, { sparse: true });

export const EmergencyRequest =
  mongoose.models.EmergencyRequest ?? mongoose.model('EmergencyRequest', emergencySchema);
