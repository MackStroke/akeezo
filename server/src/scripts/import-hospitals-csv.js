import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import crypto from 'node:crypto';

const DATA_DIR = path.resolve(import.meta.dirname, '../../.data');
const CSV_PATH = path.resolve(import.meta.dirname, '../../../hospitals.csv');

const SAMPLE_IMAGES = {
  lobby: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop',
  icu: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&h=400&fit=crop',
  room: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&h=400&fit=crop',
  exterior: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop',
};

const CITY_COORDS = {
  'New Delhi': [77.2090, 28.6139],
  'Gurugram': [77.0266, 28.4595],
  'Noida': [77.3910, 28.5355],
  'Faridabad': [77.3178, 28.4089],
  'Mumbai': [72.8777, 19.0760],
  'Chennai': [80.2707, 13.0827],
  'Hyderabad': [78.4867, 17.3850],
  'Bengaluru': [77.5946, 12.9716],
  'Kolkata': [88.3639, 22.5726],
  'Ahmedabad': [72.5714, 23.0225],
  'Kochi': [76.2711, 9.9312],
  'Jaipur': [75.7873, 26.9124],
  'Chandigarh': [76.7794, 30.7333],
  'Pune': [73.8567, 18.5204],
};

const DEFAULT_COORDS = [77.2090, 28.6139]; // Default to Delhi

function getSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseList(str) {
  if (!str) return [];
  return str.split(',').map(s => s.trim()).filter(Boolean);
}

// Convert "Multi-Specialty, Cardiology, Neurology" to our internal IDs
const SPECIALTY_MAP = {
  'Cardiology': 'cardiac',
  'Neurology': 'neurology',
  'Oncology': 'oncology',
  'Orthopaedics': 'orthopaedics',
  'Organ Transplant': 'transplant',
  'Fertility': 'fertility',
  'IVF': 'fertility',
  'Dental': 'dental',
  'Cosmetic': 'cosmetic',
};

function mapSpecialties(str) {
  const list = parseList(str);
  const result = new Set();
  for (const item of list) {
    if (SPECIALTY_MAP[item]) result.add(SPECIALTY_MAP[item]);
    else if (item.toLowerCase().includes('multi')) {
      // Just add a few common ones for multi-specialty
      result.add('cardiac');
      result.add('orthopaedics');
    }
  }
  return Array.from(result);
}

async function importCsv() {
  const content = readFileSync(CSV_PATH, 'utf-8');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  });

  const hospitals = records.map((record, index) => {
    const city = record['City'];
    const coords = CITY_COORDS[city] || DEFAULT_COORDS;
    
    // Slight randomization so hospitals in same city don't overlap exactly
    const latOffset = (Math.random() - 0.5) * 0.05;
    const lngOffset = (Math.random() - 0.5) * 0.05;

    const specialties = mapSpecialties(record['Primary Specialties / Centers of Excellence']);
    if (specialties.length === 0) specialties.push('cardiac'); // fallback

    const accreditations = parseList(record['Accreditations']);
    
    return {
      _id: crypto.randomUUID(),
      hospitalId: record['Hospital ID'],
      name: record['Hospital Name'],
      slug: getSlug(record['Hospital Name']) + '-' + index,
      stateRegion: record['State / Region'],
      city: city,
      locality: record['Locality / Area'],
      address: `${record['Locality / Area']}, ${city}, ${record['State / Region']}`,
      location: {
        type: 'Point',
        coordinates: [coords[0] + lngOffset, coords[1] + latOffset]
      },
      bedCapacity: parseInt(record['Bed Capacity (approx)']) || 0,
      type: record['Type'],
      hasEmergency: record['Emergency / Trauma Care (24x7)']?.toLowerCase() === 'yes',
      facilities: parseList(record['Key Facilities']),
      rating: parseFloat(record['Rating (out of 5.0)']) || 4.0,
      contact: record['Contact / Helpline'],
      website: record['Website URL'],
      listingStatus: record['Listing Status'] || 'Active',
      
      specialties: specialties,
      accreditations: accreditations,
      centersOfExcellence: specialties.slice(0, 2), // first two are CoE
      
      // Generate some dummy data for UI completion
      experienceTier: 'best_value',
      partnerTier: 'silver',
      amenities: ['international_patient_desk', 'english_speaking'],
      languages: ['English', 'Hindi'],
      stayLogistics: ['shortest_stay'],
      
      nearestAirport: {
        name: 'International Airport',
        code: city.substring(0, 3).toUpperCase(),
        distanceKm: Math.floor(Math.random() * 30) + 5
      },
      
      doctors: [
        { name: 'Dr. Sample ' + index, specialty: specialties[0], designation: 'Senior Consultant', experienceYears: 15, languages: ['English', 'Hindi'] }
      ],
      
      treatmentEstimates: specialties.map(s => ({
        treatmentId: s,
        treatmentLabel: s,
        procedure: 'Standard Procedure',
        costRange: { min: 200000, max: 400000 },
        stayDays: { min: 5, max: 10 }
      })),
      
      images: [
        { url: SAMPLE_IMAGES.lobby, alt: 'Lobby', category: 'lobby' },
        { url: SAMPLE_IMAGES.exterior, alt: 'Exterior', category: 'exterior' }
      ],
      description: `Leading ${record['Type'] || 'healthcare'} institution in ${city}, offering comprehensive medical services with ${record['Bed Capacity (approx)']} beds.`,
      isActive: record['Listing Status'] !== 'Inactive',
      isSample: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(
    path.join(DATA_DIR, 'hospitals.json'),
    JSON.stringify(hospitals, null, 2),
    'utf8',
  );
  console.log(`✓ Wrote ${hospitals.length} imported hospitals to ${DATA_DIR}/hospitals.json`);

  if (process.env.MONGODB_URI) {
    const mongoose = await import('mongoose');
    await mongoose.default.connect(process.env.MONGODB_URI);
    const { Hospital } = await import('../models/Hospital.js');
    await Hospital.deleteMany({ isSample: true });
    await Hospital.insertMany(hospitals);
    console.log(`✓ Inserted ${hospitals.length} imported hospitals into MongoDB`);
    await mongoose.default.disconnect();
  }
}

importCsv().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
