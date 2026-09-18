import { Router } from 'express';
import { z } from 'zod';
import { Recommendation } from '../models/Recommendation.js';
import { create, FILES } from '../utils/store.js';
import { makeJourneyId } from '../utils/journeyId.js';
import { leadLimiter } from '../middleware/limits.js';

const router = Router();

const phone = z
  .string()
  .trim()
  .min(6, 'Please enter a valid phone number.')
  .max(32)
  .regex(/^[+0-9][0-9\s()\-.]*$/, 'Please enter a valid phone number.');

const recommendationSchema = z.object({
  type: z.enum(['city', 'country']).default('city'),
  targetName: z.string().trim().min(2, 'Please enter a city or country name.').max(120),
  region: z.string().trim().max(120).optional().or(z.literal('')),
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  phone,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.')
    .max(160),
  reason: z.string().trim().max(2000).optional().or(z.literal('')),
});

router.post('/', leadLimiter, async (req, res, next) => {
  try {
    const data = recommendationSchema.parse(req.body);
    const recommendationId = 'REC-' + makeJourneyId(data.type === 'city' ? 'CTY' : 'CTR');

    const rec = await create(Recommendation, FILES.recommendations, {
      ...data,
      recommendationId,
      status: 'new',
    });

    res.status(201).json({
      ok: true,
      data: {
        recommendationId: rec.recommendationId,
        message: `Thank you! Your recommendation for "${data.targetName}" has been received.`,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
