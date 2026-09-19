/**
 * Thin API client.
 *
 * In dev, Vite proxies /api to the Express server, so the browser sees one
 * origin and CORS never comes up. In production VITE_API_BASE_URL points at the
 * deployed API (or stays empty when both are served from the same origin).
 */
const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  constructor(message, { status, fields } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    /** Field-level messages keyed by field name, when the API returned them. */
    this.fields = fields ?? null;
  }
}

async function post(path, body, { timeoutMs = 15000 } = {}) {
  // Never let a hung request leave a submit button spinning forever.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      },
      cache: 'no-store',
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new ApiError('That took too long. Please call us instead — we can help straight away.');
    }
    throw new ApiError('We could not reach AKEEZO. Check your connection, or call us instead.');
  }
  clearTimeout(timer);

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    // A non-JSON body means something upstream broke; fall through to the
    // status-based message below.
  }

  if (!response.ok || !payload?.ok) {
    throw new ApiError(payload?.error?.message ?? 'Something went wrong. Please call us instead.', {
      status: response.status,
      fields: payload?.error?.fields,
    });
  }

  return payload.data;
}

/** Submits a planned-care enquiry. Resolves with { journeyId, message }. */
export const submitLead = (lead) =>
  post('/api/leads', {
    ...lead,
    source: {
      page: window.location.pathname,
      referrer: document.referrer || undefined,
      utm: readUtm(),
    },
  });

/** Submits an emergency request. Resolves with { caseId, message }. */
export const submitEmergency = (request) => post('/api/emergency', request, { timeoutMs: 10000 });

/** Submits a city or country recommendation. Resolves with { recommendationId, message }. */
export const submitRecommendation = (recommendation) =>
  post('/api/recommendations', recommendation);

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  for (const [key, value] of params) {
    if (key.startsWith('utm_')) utm[key] = value.slice(0, 200);
  }
  return Object.keys(utm).length ? utm : undefined;
}

async function get(path, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  const urlWithCacheBust = `${BASE}${path}${path.includes('?') ? '&' : '?'}_t=${Date.now()}`;
  try {
    response = await fetch(urlWithCacheBust, {
      signal: controller.signal,
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store',
        Pragma: 'no-cache',
      },
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please try again.');
    }
    throw new ApiError('Could not reach AKEEZO. Check your connection.');
  }
  clearTimeout(timer);

  let payload = null;
  try {
    payload = await response.json();
  } catch {}

  if (!response.ok || !payload?.ok) {
    throw new ApiError(payload?.error?.message ?? 'Something went wrong.', {
      status: response.status,
    });
  }

  return payload.data;
}

/** Fetches paginated hospital listing with filter params. */
export const fetchHospitals = (params) =>
  get(`/api/hospitals?${new URLSearchParams(params)}`);

/** Fetches a single hospital by slug. */
export const fetchHospital = (slug) =>
  get(`/api/hospitals/${encodeURIComponent(slug)}`);

