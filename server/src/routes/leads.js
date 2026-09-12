import { Router } from 'express';
import { z } from 'zod';
import { Lead } from '../models/Lead.js';
import { create, FILES } from '../utils/store.js';
import { makeJourneyId } from '../utils/journeyId.js';
import { leadLimiter } from '../middleware/limits.js';

const router = Router();

// Phone numbers arrive in every conceivable shape from every country; accept
// anything plausibly dialable and normalise later rather than rejecting a
// patient over punctuation.
const phone = z
  .string()
  .trim()
  .min(6, 'Please enter a phone number we can reach you on.')
  .max(32)
  .regex(/^[+0-9][0-9\s()\-.]*$/, 'Please enter a valid phone number.');

const leadSchema = z.object({
  intent: z.enum(['medical_tourism', 'home_healthcare', 'general_enquiry']).default('general_enquiry'),
  treatment: z.string().trim().max(120).optional(),
  name: z.string().trim().min(2, 'Please tell us your name.').max(120),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(160).optional().or(z.literal('')),
  phone,
  country: z.string().trim().max(80).optional(),
  preferredCity: z.string().trim().max(80).optional(),
  preferredLanguage: z.string().trim().max(40).optional(),
  urgency: z
    .enum(['emergency', 'within_48h', 'within_1_week', 'within_1_month', 'later', 'not_sure'])
    .default('not_sure'),
  message: z.string().trim().max(4000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'We need your consent to contact you about your enquiry.' }),
  }),
  source: z
    .object({
      page: z.string().trim().max(200).optional(),
      referrer: z.string().trim().max(500).optional(),
      utm: z.record(z.string().max(200)).optional(),
    })
    .optional(),
});

router.post('/', leadLimiter, async (req, res, next) => {
  try {
    const data = leadSchema.parse(req.body);
    const journeyId = makeJourneyId(data.country ? data.country.slice(0, 3) : 'INT');

    const lead = await create(Lead, FILES.leads, { ...data, journeyId });

    // 201 + the quotable id. The UI shows this immediately — it is the patient's
    // only handle on the enquiry until the Phase 4 dashboard exists.
    res.status(201).json({
      ok: true,
      data: {
        journeyId: lead.journeyId,
        message: 'Your AKEEZO healthcare request has been received.',
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
