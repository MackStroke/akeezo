import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import { isDatabaseConnected } from '../config/db.js';
import { Lead } from '../models/Lead.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Hospital } from '../models/Hospital.js';
import { Recommendation } from '../models/Recommendation.js';

const DATA_DIR = path.resolve(import.meta.dirname, '../../.data');

async function readCollection(file) {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function appendToCollection(file, doc) {
  await mkdir(DATA_DIR, { recursive: true });
  const rows = await readCollection(file);
  rows.push(doc);
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return doc;
}

export async function create(Model, file, data) {
  if (isDatabaseConnected()) {
    const doc = await Model.create(data);
    return doc.toObject();
  }
  return appendToCollection(file, {
    ...data,
    _id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function count(Model, file) {
  if (isDatabaseConnected()) return Model.estimatedDocumentCount();
  return (await readCollection(file)).length;
}

export async function find(Model, file, query = {}) {
  if (isDatabaseConnected()) {
    return Model.find(query).sort({ createdAt: -1 }).lean();
  }
  const rows = await readCollection(file);
  return rows.filter(row => {
    for (const key in query) {
      if (row[key] !== query[key]) return false;
    }
    return true;
  });
}

function makeIdQuery(id) {
  if (!id) return { _id: id };
  const isMongoId = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === String(id);
  if (isMongoId) {
    return { $or: [{ _id: id }, { journeyId: id }, { caseId: id }, { recommendationId: id }, { slug: id }] };
  }
  return { $or: [{ journeyId: id }, { caseId: id }, { recommendationId: id }, { slug: id }] };
}

function matchRecord(r, id) {
  return (
    (r._id || r.id)?.toString() === id ||
    r.journeyId === id ||
    r.caseId === id ||
    r.recommendationId === id ||
    r.slug === id
  );
}

export async function findById(Model, file, id) {
  if (isDatabaseConnected()) {
    return Model.findOne(makeIdQuery(id)).lean();
  }
  const rows = await readCollection(file);
  return rows.find(r => matchRecord(r, id));
}

export async function updateById(Model, file, id, updates) {
  if (isDatabaseConnected()) {
    const doc = await Model.findOneAndUpdate(makeIdQuery(id), updates, { new: true }).lean();
    return doc;
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => matchRecord(r, id));
  if (index === -1) return null;
  
  const updatedDoc = { ...rows[index], ...updates, updatedAt: new Date().toISOString() };
  rows[index] = updatedDoc;
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return updatedDoc;
}

export async function addNoteToLead(Model, file, id, note) {
  if (isDatabaseConnected()) {
    const doc = await Model.findOneAndUpdate(
      makeIdQuery(id), 
      { $push: { notes: note } },
      { new: true }
    ).lean();
    return doc;
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => matchRecord(r, id));
  if (index === -1) return null;
  
  if (!rows[index].notes) rows[index].notes = [];
  rows[index].notes.push(note);
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return rows[index];
}

export async function deleteById(Model, file, id) {
  if (isDatabaseConnected()) {
    return Model.findOneAndDelete(makeIdQuery(id)).lean();
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => matchRecord(r, id));
  if (index === -1) return null;
  
  const deletedDoc = rows[index];
  rows.splice(index, 1);
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return deletedDoc;
}

export async function findPaginated(Model, file, { filter = {}, sort = { createdAt: -1 }, page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  if (isDatabaseConnected()) {
    const [docs, total] = await Promise.all([
      Model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Model.countDocuments(filter),
    ]);
    return { data: docs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  let rows = await readCollection(file);
  for (const key in filter) {
    const val = filter[key];
    if (val && typeof val === 'object' && val.$in) {
      rows = rows.filter(r => {
        const field = r[key];
        return Array.isArray(field)
          ? field.some(v => val.$in.includes(v))
          : val.$in.includes(field);
      });
    } else if (val && typeof val === 'object' && val.$regex) {
      const re = new RegExp(val.$regex, val.$options || '');
      rows = rows.filter(r => re.test(r[key] ?? ''));
    } else {
      rows = rows.filter(r => r[key] === val);
    }
  }

  const total = rows.length;
  const sortKey = Object.keys(sort)[0] || 'createdAt';
  const sortDir = sort[sortKey] === 1 ? 1 : -1;
  rows.sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return -1 * sortDir;
    if (a[sortKey] > b[sortKey]) return 1 * sortDir;
    return 0;
  });

  return {
    data: rows.slice(skip, skip + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export const FILES = {
  leads: 'leads.json',
  emergency: 'emergency-requests.json',
  hospitals: 'hospitals.json',
  recommendations: 'recommendations.json',
};

export async function syncTempDataToMongo() {
  if (!isDatabaseConnected()) return;

  console.log('[store] Checking and syncing local temp data to MongoDB...');

  const mappings = [
    { file: FILES.leads, Model: Lead, key: 'journeyId', clearOnSync: true },
    { file: FILES.emergency, Model: EmergencyRequest, key: 'caseId', clearOnSync: true },
    { file: FILES.hospitals, Model: Hospital, key: 'slug', clearOnSync: false },
    { file: FILES.recommendations, Model: Recommendation, key: 'recommendationId', clearOnSync: true },
  ];

  for (const { file, Model, key, clearOnSync } of mappings) {
    try {
      const rows = await readCollection(file);
      if (!rows || rows.length === 0) continue;

      let syncedCount = 0;
      for (const row of rows) {
        const cleanDoc = { ...row };
        if (typeof cleanDoc._id === 'string') {
          delete cleanDoc._id;
        }

        const filter = row[key] ? { [key]: row[key] } : (row._id ? { _id: row._id } : null);
        if (!filter) continue;

        await Model.findOneAndUpdate(
          filter,
          { $set: cleanDoc },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        syncedCount++;
      }

      if (syncedCount > 0) {
        console.log(`[store] Synced ${syncedCount} item(s) from ${file} to MongoDB.`);
        if (clearOnSync) {
          await writeFile(path.join(DATA_DIR, file), JSON.stringify([], null, 2), 'utf8');
          console.log(`[store] Cleared temporary fallback file ${file}.`);
        }
      }
    } catch (err) {
      console.error(`[store] Failed to sync ${file} to MongoDB:`, err.message);
    }
  }
}

