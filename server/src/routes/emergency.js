import { Router } from 'express';
import { z } from 'zod';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { create, FILES } from '../utils/store.js';
import { makeCaseId } from '../utils/journeyId.js';
import { emergencyLimiter } from '../middleware/limits.js';
import { sendEmergencyEmail } from '../services/email.js';

const router = Router();

/**
 * Validation here is deliberately permissive.
 *
 * Every field except "how do we call you back" is optional or defaulted. A
 * half-filled emergency request that reaches the desk with a phone number is
 * worth far more than a perfectly validated one the caller abandoned.
 */
const emergencySchema = z.object({
  location: z
    .object({
      label: z.string().trim().max(300).optional(),
      placeType: z
        .enum(['home', 'hotel', 'airport', 'railway_station', 'office', 'road', 'other'])
        .default('other'),
      // Accepted as {lat, lng} from the browser geolocation API, stored as GeoJSON.
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
      accuracyMetres: z.number().nonnegative().max(100000).optional(),
    })
    .default({}),

  problem: z.string().trim().min(2, 'Tell us briefly what happened.').max(120),
  conscious: z.enum(['yes', 'no', 'not_sure']).default('not_sure'),
  breathingNormally: z.enum(['yes', 'no', 'not_sure']).default('not_sure'),
  helpNeeded: z.array(z.string().trim().max(60)).max(12).default(['not_sure']),

  requesterName: z.string().trim().min(2, 'Please tell us your name.').max(120),
  requesterPhone: z
    .string()
    .trim()
    .min(6, 'We need a number to call you back on.')
    .max(32)
    .regex(/^[+0-9][0-9\s()\-.]*$/, 'Please enter a valid phone number.'),
  patientName: z.string().trim().max(120).optional(),
  relationship: z.string().trim().max(60).optional(),
  requesterType: z
    .enum(['patient', 'family', 'hotel', 'airport', 'company', 'school', 'travel_agent', 'embassy', 'hospital', 'insurer', 'other'])
    .default('family'),
});

router.post('/', emergencyLimiter, async (req, res, next) => {
  try {
    const data = emergencySchema.parse(req.body);
    const caseId = makeCaseId();

    const { lat, lng, ...restLocation } = data.location;
    const location = {
      ...restLocation,
      ...(typeof lat === 'number' && typeof lng === 'number'
        ? { coordinates: [lng, lat] } // GeoJSON is [longitude, latitude].
        : {}),
    };

    const doc = await create(EmergencyRequest, FILES.emergency, {
      ...data,
      location,
      caseId,
      status: 'received',
      timeline: [{ at: new Date(), status: 'received', note: 'Request received from website.' }],
    });

    // Phase 3 wires this to the Emergency Control Desk: pager/SMS to the on-call
    // coordinator, an audible alert on the desk dashboard, and an auto-dial-back.
    console.warn(`[emergency] NEW CASE ${doc.caseId} — ${data.problem} — call ${data.requesterPhone}`);

    // Fire-and-forget SOS email — never delay the patient's acknowledgement
    sendEmergencyEmail({
      caseId: doc.caseId,
      callerName: data.requesterName,
      callerPhone: data.requesterPhone,
      patientName: data.patientName,
      problem: data.problem,
      location: data.location?.label,
      conscious: data.conscious,
      breathing: data.breathingNormally,
      createdAt: doc.createdAt,
    }).catch(err => console.error('[email] emergency notification failed:', err.message));

    res.status(201).json({
      ok: true,
      data: {
        caseId: doc.caseId,
        message: 'Request received. An AKEEZO coordinator is calling you now.',
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
