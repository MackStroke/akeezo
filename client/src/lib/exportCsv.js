/**
 * exportCsv — pure client-side CSV export, no library needed.
 *
 * @param {string}   filename   e.g. "leads-2024-09-20"
 * @param {string[]} headers    Column display names
 * @param {string[]} keys       Object keys matching `headers` (same order)
 * @param {object[]} rows       Array of data objects
 */
export function exportCsv(filename, headers, keys, rows) {
  const escape = (v) => {
    const str = v == null ? '' : String(v);
    // Wrap in quotes if it contains comma, newline, or quote
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const lines = [
    headers.map(escape).join(','),
    ...rows.map(row => keys.map(k => escape(row[k])).join(',')),
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Per-entity column definitions ───────────────────────────────────────────

export const LEAD_EXPORT = {
  headers: ['Journey ID', 'Name', 'Phone', 'Email', 'Country', 'Intent', 'Treatment', 'Urgency', 'Status', 'Message', 'Date'],
  keys:    ['journeyId',  'name', 'phone', 'email', 'country', 'intent', 'treatment', 'urgency', 'status', 'message', 'createdAt'],
};

export const EMERGENCY_EXPORT = {
  headers: ['Case ID',  'Caller Name',    'Caller Phone',    'Patient Name',  'Problem', 'Location',       'Conscious', 'Breathing',         'Status', 'Date'],
  keys:    ['caseId',   'requesterName',  'requesterPhone',  'patientName',   'problem', '_locationLabel', 'conscious', 'breathingNormally', 'status', 'createdAt'],
};

export const USER_EXPORT = {
  headers: ['User ID', 'Name', 'Email', 'Phone', 'Nationality', 'Status', 'Joined'],
  keys:    ['userId',  'name', 'email', 'phone', 'nationality', 'status', 'createdAt'],
};

export const BLOG_EXPORT = {
  headers: ['ID',  'Title', 'Category', 'Author', 'Status', 'Views', 'Date'],
  keys:    ['_id', 'title', 'category', 'author', 'status', 'views', 'date'],
};

// Flatten emergency location label before export
export function prepareEmergencyRows(rows) {
  return rows.map(r => ({
    ...r,
    _locationLabel: r.location?.label || r.location?.placeType || '',
  }));
}
