import { randomInt } from 'node:crypto';

/**
 * Human-quotable identifiers. A patient reads these out over the phone, so they
 * avoid ambiguous characters and keep the country in the middle:
 *   AKZ-IND-000123   planned care
 *   AKZ-EMG-000123   emergency case
 *
 * The counter is per-process today. When Mongo is the store, Phase 3 should move
 * this to a `counters` collection with findOneAndUpdate($inc) so that multiple
 * API instances cannot collide.
 */
const pad = (n) => String(n).padStart(6, '0');

export function makeJourneyId(countryCode = 'IND') {
  const cc = String(countryCode).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'INT';
  return `AKZ-${cc}-${pad(randomInt(1, 999999))}`;
}

export function makeCaseId() {
  return `AKZ-EMG-${pad(randomInt(1, 999999))}`;
}
