import rateLimit from 'express-rate-limit';

/**
 * Planned-care forms are rate limited normally.
 */
export const leadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { ok: false, error: { message: 'Too many enquiries from this device. Please call us instead.' } },
});

/**
 * Emergency submissions get a much looser limit, on purpose.
 *
 * A panicking caller retrying the form five times must not be locked out, and a
 * hotel front desk can legitimately raise several cases from one IP. The cap is
 * high enough to be a crude flood guard only; real abuse handling belongs at the
 * edge/WAF, never in the path of someone reporting a collapse.
 */
export const emergencyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 40,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    ok: false,
    error: { message: 'We could not accept this request. Call the emergency number on screen now.' },
  },
});
