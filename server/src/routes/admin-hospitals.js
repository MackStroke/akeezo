import { Router } from 'express';
import { findPaginated, updateById, create, FILES } from '../utils/store.js';
import { isDatabaseConnected } from '../config/db.js';
import { Hospital } from '../models/Hospital.js';
import crypto from 'crypto';

const router = Router();

// GET /api/admin/hospitals - list all hospitals (including inactive)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    let result;
    if (isDatabaseConnected()) {
      const skip = (page - 1) * limit;
      const data = await Hospital.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
      const total = await Hospital.countDocuments({});
      result = { data, total, page, limit };
    } else {
      result = await findPaginated(Hospital, FILES.hospitals, {
        sort: { createdAt: -1 },
        page,
        limit,
      });
    }

    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/hospitals - create a new hospital
router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    
    // Auto-generate basic fields if missing
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (!data.hospitalId) {
      data.hospitalId = 'HOSP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    const result = await create(Hospital, FILES.hospitals, data);
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/hospitals/:id - get single hospital
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let result;
    if (isDatabaseConnected()) {
      result = await Hospital.findById(id).lean();
    } else {
      const all = await findPaginated(Hospital, FILES.hospitals, { limit: 1000 });
      result = all.data.find(h => h._id === id || h._id?.toString() === id);
    }
    
    if (!result) {
      return res.status(404).json({ ok: false, error: 'Hospital not found' });
    }
    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/hospitals/:id - update a hospital
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await updateById(Hospital, FILES.hospitals, id, updateData);
    if (!result) {
      return res.status(404).json({ ok: false, error: 'Hospital not found' });
    }

    res.json({ ok: true, data: result });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/hospitals/upload - upload CSV data
router.post('/upload', async (req, res, next) => {
  try {
    const { csvData } = req.body;
    if (!csvData) {
      return res.status(400).json({ ok: false, error: 'No CSV data provided' });
    }

    const { parse } = await import('csv-parse/sync');
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    });

    const spec_map = {
      'Cardiology': 'cardiac',
      'Cardiac Surgery': 'cardiac',
      'Cardiothoracic Surgery': 'cardiac',
      'Oncology': 'oncology',
      'Orthopedics': 'orthopaedics',
      'Neurology': 'neurology',
      'Organ Transplant': 'transplant',
      'Liver Transplant': 'transplant',
      'Heart Transplant': 'transplant',
      'Bone Marrow Transplant': 'transplant',
      'Fertility': 'fertility',
      'Reproductive Medicine': 'fertility',
      'Gynecology': 'gynecology',
      'Gastroenterology': 'gastroenterology',
    };

    const newHospitals = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const hospital_name = row['Hospital Name'] || '';
      if (!hospital_name) continue;

      const slug = hospital_name.toLowerCase().replace(/ /g, '-').replace(/,/g, '').replace(/\./g, '') + `-${Date.now()}-${i}`;
      
      const specs_raw = row['Primary Specialties / Centers of Excellence'] || '';
      const raw_specs = specs_raw.split(',').map(s => s.trim()).filter(s => s && s !== 'Multi-Specialty');
      
      const specialties = Array.from(new Set(raw_specs.map(s => spec_map[s] || s.toLowerCase().replace(/ /g, '_'))));
      
      let city = row['City'] || '';
      if (['New Delhi', 'Gurugram', 'Noida'].includes(city)) {
        city = 'Delhi NCR';
      }

      const acc_raw = row['Accreditations'] || '';
      const accreditations = acc_raw.split(',').map(a => a.trim()).filter(a => a && a !== 'None');

      const fac_raw = row['Key Facilities'] || '';
      const facilities = fac_raw.split(',').map(f => f.trim()).filter(f => f);

      const bedCapacity = parseInt(row['Bed Capacity (approx)']) || 0;
      const rating = parseFloat(row['Rating (out of 5.0)']) || 4.5;
      const is_active = (row['Listing Status'] || 'Active').toLowerCase() === 'active';

      const hospital = {
        hospitalId: row['Hospital ID'] || `HOSP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        name: hospital_name,
        slug,
        stateRegion: row['State / Region'] || '',
        city,
        locality: row['Locality / Area'] || '',
        address: `${row['Locality / Area'] || ''}, ${city}, ${row['State / Region'] || ''}`.replace(/^, /, ''),
        location: {
          type: 'Point',
          coordinates: [77.2 + (i*0.01), 28.5 + (i*0.01)]
        },
        bedCapacity,
        type: row['Type'] || '',
        hasEmergency: (row['Emergency / Trauma Care (24x7)'] || '').toLowerCase() === 'yes',
        facilities,
        rating,
        contact: row['Contact / Helpline'] || '',
        website: row['Website URL'] || '',
        listingStatus: row['Listing Status'] || 'Active',
        specialties,
        accreditations,
        centersOfExcellence: specialties.slice(0, 3),
        experienceTier: bedCapacity < 500 ? 'best_value' : 'premium',
        partnerTier: rating >= 4.5 ? 'gold' : 'silver',
        amenities: ['international_patient_desk', 'english_speaking'],
        languages: ['English', 'Hindi'],
        stayLogistics: ['shortest_stay'],
        nearestAirport: { name: 'International Airport', code: 'INT', distanceKm: 15 },
        doctors: [{
          name: 'Dr. John Doe',
          specialty: specialties[0] || 'General',
          designation: 'Senior Consultant',
          experienceYears: 15,
          languages: ['English', 'Hindi']
        }],
        treatmentEstimates: (specialties.slice(0, 2).length ? specialties.slice(0, 2) : ['General']).map((s, idx) => ({
          treatmentId: s,
          treatmentLabel: raw_specs[idx] || s,
          procedure: 'Standard Procedure',
          costRange: { min: 200000, max: 400000 },
          stayDays: { min: 5, max: 10 }
        })),
        images: [
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop', alt: 'Lobby', category: 'lobby' },
          { url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop', alt: 'Exterior', category: 'exterior' }
        ],
        description: `Leading ${row['Type'] || ''} institution in ${city}, offering comprehensive medical services.`,
        isActive: is_active,
        isSample: false
      };

      await create(Hospital, FILES.hospitals, hospital);
      newHospitals.push(hospital);
    }

    res.json({ ok: true, message: `Successfully imported ${newHospitals.length} hospitals` });
  } catch (err) {
    next(err);
  }
});

export default router;
