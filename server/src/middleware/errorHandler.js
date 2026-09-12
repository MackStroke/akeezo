import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFound = (req, res) => {
  res.status(404).json({ ok: false, error: { message: `No route for ${req.method} ${req.originalUrl}` } });
};

// eslint-disable-next-line no-unused-vars -- Express identifies error handlers by arity.
export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      ok: false,
      error: {
        message: 'Some details need correcting.',
        fields: Object.fromEntries(
          err.issues.map((i) => [i.path.join('.') || '_', i.message]),
        ),
      },
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ ok: false, error: { message: err.message, details: err.details } });
  }

  // Duplicate key on journeyId/caseId — vanishingly rare, but retryable.
  if (err?.code === 11000) {
    return res.status(409).json({ ok: false, error: { message: 'Duplicate request. Please try again.' } });
  }

  console.error('[error]', err);
  res.status(500).json({
    ok: false,
    error: { message: 'Something went wrong on our side. Please call us instead.' },
  });
};
