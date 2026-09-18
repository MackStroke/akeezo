import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isDatabaseConnected } from '../config/db.js';

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

export async function findById(Model, file, id) {
  if (isDatabaseConnected()) {
    return Model.findById(id).lean();
  }
  const rows = await readCollection(file);
  return rows.find(r => (r._id || r.id)?.toString() === id);
}

export async function updateById(Model, file, id, updates) {
  if (isDatabaseConnected()) {
    const doc = await Model.findByIdAndUpdate(id, updates, { new: true }).lean();
    return doc;
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => (r._id || r.id)?.toString() === id);
  if (index === -1) return null;
  
  const updatedDoc = { ...rows[index], ...updates, updatedAt: new Date().toISOString() };
  rows[index] = updatedDoc;
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return updatedDoc;
}

export async function addNoteToLead(Model, file, id, note) {
  if (isDatabaseConnected()) {
    const doc = await Model.findByIdAndUpdate(
      id, 
      { $push: { notes: note } },
      { new: true }
    ).lean();
    return doc;
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => (r._id || r.id)?.toString() === id);
  if (index === -1) return null;
  
  if (!rows[index].notes) rows[index].notes = [];
  rows[index].notes.push(note);
  await writeFile(path.join(DATA_DIR, file), JSON.stringify(rows, null, 2), 'utf8');
  return rows[index];
}

export async function deleteById(Model, file, id) {
  if (isDatabaseConnected()) {
    return Model.findByIdAndDelete(id).lean();
  }
  
  const rows = await readCollection(file);
  const index = rows.findIndex(r => (r._id || r.id)?.toString() === id);
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
