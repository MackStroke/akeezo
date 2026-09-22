import { Router } from 'express';
import { Hospital } from '../models/Hospital.js';
import { findPaginated, findById, FILES } from '../utils/store.js';
import { isDatabaseConnected } from '../config/db.js';

const router = Router();

/**
 * GET /api/hospitals
 * Paginated, filtered hospital listing.
 *
 * Query params:
 *   city        — comma-separated city names (e.g. "Delhi NCR,Mumbai")
 *   specialty   — comma-separated specialty ids (e.g. "cardiac,oncology")
 *   accreditation — comma-separated (e.g. "NABH,JCI")
 *   amenity     — comma-separated amenity keys
 *   experience  — single experience tier (best_value | best_medical | premium)
 *   stayLogistic — comma-separated stay logistics keys
 *   sort        — recommended | cost_asc | cost_desc | airport_distance | availability
 *   q           — free-text search
 *   costMin / costMax — treatment cost range filter (INR)
 *   page / limit — pagination
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      city,
      specialty,
      accreditation,
      amenity,
      experience,
      stayLogistic,
      type,
      hasEmergency,
      sort = 'recommended',
      q,
      costMin,
      costMax,
      page = '1',
      limit = '20',
    } = req.query;

    const filter = { isActive: true };

    if (city) {
      const cities = city.split(',').map(c => c.trim());
      filter.city = { $in: cities };
    }

    if (specialty) {
      const specs = specialty.split(',').map(s => s.trim());
      filter.specialties = { $in: specs };
    }

    if (accreditation) {
      const accreds = accreditation.split(',').map(a => a.trim());
      filter.accreditations = { $in: accreds };
    }

    if (type) {
      const types = type.split(',').map(t => t.trim());
      filter.type = { $in: types };
    }

    if (hasEmergency === 'true') {
      filter.hasEmergency = true;
    }

    if (amenity) {
      const amenities = amenity.split(',').map(a => a.trim());
      filter.amenities = { $in: amenities };
    }

    if (experience) {
      filter.experienceTier = experience;
    }

    if (stayLogistic) {
      const logistics = stayLogistic.split(',').map(s => s.trim());
      filter.stayLogistics = { $in: logistics };
    }

    // Text search — use $regex for compatibility with both Mongoose and JSON store
    if (q && q.trim()) {
      filter.name = { $regex: q.trim(), $options: 'i' };
    }

    // Sort mapping
    const sortMap = {
      recommended: { partnerTier: 1, createdAt: -1 },
      cost_asc: { 'treatmentEstimates.costRange.min': 1 },
      cost_desc: { 'treatmentEstimates.costRange.max': -1 },
      airport_distance: { 'nearestAirport.distanceKm': 1 },
      availability: { 'doctors.length': -1, createdAt: -1 },
    };

    const sortOrder = sortMap[sort] || sortMap.recommended;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

    // For cost range filtering with Mongoose, we need a more complex query
    if (isDatabaseConnected() && (costMin || costMax)) {
      const costFilter = {};
      if (costMin) costFilter['treatmentEstimates.costRange.min'] = { $gte: parseInt(costMin, 10) };
      if (costMax) costFilter['treatmentEstimates.costRange.max'] = { $lte: parseInt(costMax, 10) };
      Object.assign(filter, costFilter);
    }

    const result = await findPaginated(Hospital, FILES.hospitals, {
      filter,
      sort: sortOrder,
      page: pageNum,
      limit: limitNum,
    });

    // Post-filter cost range for JSON store fallback
    if (!isDatabaseConnected() && (costMin || costMax)) {
      const min = costMin ? parseInt(costMin, 10) : 0;
      const max = costMax ? parseInt(costMax, 10) : Infinity;
      result.data = result.data.filter(h =>
        h.treatmentEstimates?.some(
          t => t.costRange.min >= min && t.costRange.max <= max,
        ),
      );
      result.total = result.data.length;
    }

    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/hospitals/:slug
 * Single hospital detail by slug.
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    let hospital;

    if (isDatabaseConnected()) {
      hospital = await Hospital.findOne({ slug, isActive: true }).lean();
    } else {
      // JSON store fallback — read all and find by slug
      const all = await findPaginated(Hospital, FILES.hospitals, {
        filter: { isActive: true },
        limit: 1000,
      });
      hospital = all.data.find(h => h.slug === slug);
    }

    if (!hospital) {
      return res.status(404).json({ ok: false, error: { message: 'Hospital not found' } });
    }

    res.json({ ok: true, data: hospital });
  } catch (err) {
    next(err);
  }
});

export default router;
