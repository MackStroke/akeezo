/**
 * AKEEZO Email Service — powered by Nodemailer
 *
 * Configure these env vars:
 *   EMAIL_HOST       SMTP host            e.g. smtp.gmail.com
 *   EMAIL_PORT       SMTP port            e.g. 465 (SSL) or 587 (TLS)
 *   EMAIL_SECURE     true for SSL/465     false for STARTTLS/587
 *   EMAIL_USER       sender address       e.g. noreply@akeezo.com
 *   EMAIL_PASS       sender password/app-password
 *   EMAIL_FROM       display name + addr  e.g. "AKEEZO Platform <noreply@akeezo.com>"
 *   NOTIFY_EMAIL     recipient(s)         comma-separated, e.g. admin@akeezo.com,ops@akeezo.com
 *
 * Gmail quick-start:
 *   EMAIL_HOST=smtp.gmail.com
 *   EMAIL_PORT=465
 *   EMAIL_SECURE=true
 *   EMAIL_USER=you@gmail.com
 *   EMAIL_PASS=<16-char App Password from Google Account › Security › 2-Step Verification>
 *   EMAIL_FROM="AKEEZO Alerts <you@gmail.com>"
 *   NOTIFY_EMAIL=you@gmail.com
 */

import nodemailer from 'nodemailer';

// ─── Transporter (lazy singleton) ────────────────────────────────────────────
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const host = process.env.EMAIL_HOST;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !user || !pass) {
    console.warn('[email] EMAIL_HOST / EMAIL_USER / EMAIL_PASS not configured — emails disabled.');
    return null;
  }

  _transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_PORT ?? 465),
    secure: process.env.EMAIL_SECURE !== 'false', // default true
    auth: { user, pass },
  });

  return _transporter;
}

// ─── Recipients ──────────────────────────────────────────────────────────────
export function getNotifyEmails() {
  const raw = process.env.NOTIFY_EMAIL ?? process.env.EMAIL_USER ?? '';
  return raw.split(',').map(e => e.trim()).filter(Boolean);
}

// ─── Core send ───────────────────────────────────────────────────────────────
export async function sendEmail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, reason: 'not_configured' };

  const recipients = Array.isArray(to) ? to.join(', ') : to;
  const from = process.env.EMAIL_FROM ?? process.env.EMAIL_USER;

  try {
    const info = await transporter.sendMail({ from, to: recipients, subject, html, text });
    console.log(`[email] Sent "${subject}" → ${recipients} (${info.messageId})`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('[email] Send failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// ─── Shared HTML shell ───────────────────────────────────────────────────────
function shell(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { margin:0; padding:0; background:#f4f6f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color:#1a1a2e; }
    .wrap { max-width:640px; margin:32px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:linear-gradient(135deg,#1D265D 0%,#0d6efd 100%); padding:28px 32px; }
    .header h1 { margin:0; color:#fff; font-size:22px; font-weight:800; letter-spacing:-0.5px; }
    .header p  { margin:4px 0 0; color:rgba(255,255,255,0.75); font-size:13px; }
    .body { padding:28px 32px; }
    .section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#6b7280; border-bottom:1px solid #e5e7eb; padding-bottom:8px; margin:24px 0 12px; }
    .kv { display:flex; gap:8px; padding:6px 0; border-bottom:1px solid #f3f4f6; font-size:14px; }
    .kv .k { color:#6b7280; min-width:140px; font-weight:600; }
    .kv .v { color:#111827; word-break:break-word; }
    .badge { display:inline-block; padding:2px 10px; border-radius:99px; font-size:12px; font-weight:700; }
    .badge-new       { background:#dbeafe; color:#1d4ed8; }
    .badge-emergency { background:#fee2e2; color:#b91c1c; }
    .badge-converted { background:#d1fae5; color:#065f46; }
    .badge-lost      { background:#fce7f3; color:#9d174d; }
    .cta { display:inline-block; margin-top:20px; padding:12px 24px; background:#1D265D; color:#fff; border-radius:8px; text-decoration:none; font-weight:700; font-size:14px; }
    .footer { padding:20px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; font-size:12px; color:#9ca3af; }
    table.data { width:100%; border-collapse:collapse; font-size:13px; }
    table.data th { background:#f3f4f6; padding:8px 12px; text-align:left; font-weight:700; color:#374151; }
    table.data td { padding:8px 12px; border-bottom:1px solid #f3f4f6; }
    table.data tr:last-child td { border:none; }
    .sos-banner { background:#fee2e2; border:2px solid #f87171; border-radius:8px; padding:16px; margin-bottom:20px; }
    .sos-banner h2 { margin:0 0 4px; color:#b91c1c; font-size:18px; }
    .sos-banner p  { margin:0; color:#7f1d1d; font-size:13px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>🏥 AKEEZO Platform</h1>
      <p>${title}</p>
    </div>
    <div class="body">${body}</div>
    <div class="footer">
      This is an automated notification from the AKEEZO Healthcare Platform.<br/>
      <a href="${process.env.SITE_URL ?? 'https://akeezo.com'}/admin" style="color:#6b7280;">Open Admin Panel</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── 1. New Lead Notification ─────────────────────────────────────────────────
export async function sendNewLeadEmail(lead) {
  const to = getNotifyEmails();
  if (!to.length) return;

  const body = `
    <p>A new patient enquiry has been submitted on the AKEEZO platform.</p>
    <div class="section-title">Lead Details</div>
    <div class="kv"><span class="k">Journey ID</span><span class="v"><strong>${lead.journeyId ?? '—'}</strong></span></div>
    <div class="kv"><span class="k">Name</span><span class="v">${lead.name ?? '—'}</span></div>
    <div class="kv"><span class="k">Phone</span><span class="v">${lead.phone ?? '—'}</span></div>
    <div class="kv"><span class="k">Email</span><span class="v">${lead.email ?? '—'}</span></div>
    <div class="kv"><span class="k">Country</span><span class="v">${lead.country ?? '—'}</span></div>
    <div class="kv"><span class="k">Intent</span><span class="v">${lead.intent ?? lead.type ?? '—'}</span></div>
    <div class="kv"><span class="k">Treatment</span><span class="v">${lead.treatment ?? '—'}</span></div>
    <div class="kv"><span class="k">Urgency</span><span class="v">${lead.urgency ?? '—'}</span></div>
    <div class="kv"><span class="k">Message</span><span class="v">${lead.message ?? '—'}</span></div>
    <div class="kv"><span class="k">Received</span><span class="v">${new Date(lead.createdAt ?? Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span></div>
    <a class="cta" href="${process.env.SITE_URL ?? 'https://akeezo.com'}/admin/leads/${lead._id ?? lead.id}">View in Admin Panel →</a>
  `;

  return sendEmail({
    to,
    subject: `🔔 New Lead: ${lead.name ?? 'Unknown'} — ${lead.intent ?? 'General Enquiry'} (${lead.journeyId ?? ''})`,
    html: shell('New Patient Enquiry Received', body),
    text: `New Lead from ${lead.name} | ${lead.phone} | ${lead.country} | ${lead.intent}`,
  });
}

// ─── 2. New Emergency SOS Notification ───────────────────────────────────────
export async function sendEmergencyEmail(emergency) {
  const to = getNotifyEmails();
  if (!to.length) return;

  const body = `
    <div class="sos-banner">
      <h2>🚨 EMERGENCY SOS RECEIVED</h2>
      <p>Immediate action required. A patient emergency has been reported.</p>
    </div>
    <div class="section-title">Case Details</div>
    <div class="kv"><span class="k">Case ID</span><span class="v"><strong>${emergency.caseId ?? '—'}</strong></span></div>
    <div class="kv"><span class="k">Caller Name</span><span class="v">${emergency.callerName ?? emergency.name ?? '—'}</span></div>
    <div class="kv"><span class="k">Caller Phone</span><span class="v">${emergency.callerPhone ?? emergency.phone ?? '—'}</span></div>
    <div class="kv"><span class="k">Patient Name</span><span class="v">${emergency.patientName ?? '—'}</span></div>
    <div class="kv"><span class="k">Problem</span><span class="v"><strong>${emergency.problem ?? '—'}</strong></span></div>
    <div class="kv"><span class="k">Location</span><span class="v">${emergency.location ?? emergency.address ?? '—'}</span></div>
    <div class="kv"><span class="k">Age / Gender</span><span class="v">${emergency.age ?? '—'} / ${emergency.gender ?? '—'}</span></div>
    <div class="kv"><span class="k">Conscious?</span><span class="v">${emergency.conscious ?? '—'}</span></div>
    <div class="kv"><span class="k">Breathing?</span><span class="v">${emergency.breathing ?? '—'}</span></div>
    <div class="kv"><span class="k">Received</span><span class="v">${new Date(emergency.createdAt ?? Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span></div>
    <a class="cta" style="background:#b91c1c;" href="${process.env.SITE_URL ?? 'https://akeezo.com'}/admin/emergencies/${emergency.caseId}">Respond Now →</a>
  `;

  return sendEmail({
    to,
    subject: `🚨 EMERGENCY SOS: ${emergency.problem ?? 'Unknown'} — ${emergency.callerName ?? 'Unknown'} (${emergency.caseId ?? ''})`,
    html: shell('Emergency SOS Alert', body),
    text: `EMERGENCY: ${emergency.problem} | Caller: ${emergency.callerPhone} | Location: ${emergency.location}`,
  });
}

// ─── 3. New City / Country Recommendation Notification ─────────────────────────
export async function sendRecommendationEmail(rec) {
  const to = getNotifyEmails();
  if (!to.length) return;

  const body = `
    <p>A user has suggested a new location recommendation for AKEEZO expansion.</p>
    <div class="section-title">Recommendation Details</div>
    <div class="kv"><span class="k">Recommendation ID</span><span class="v"><strong>${rec.recommendationId ?? '—'}</strong></span></div>
    <div class="kv"><span class="k">Type</span><span class="v">${rec.type === 'city' ? 'City' : 'Country'}</span></div>
    <div class="kv"><span class="k">Target Name</span><span class="v"><strong>${rec.targetName ?? '—'}</strong></span></div>
    <div class="kv"><span class="k">Region / State</span><span class="v">${rec.region ?? '—'}</span></div>
    <div class="kv"><span class="k">Recommended By</span><span class="v">${rec.name ?? '—'}</span></div>
    <div class="kv"><span class="k">Phone</span><span class="v">${rec.phone ?? '—'}</span></div>
    <div class="kv"><span class="k">Email</span><span class="v">${rec.email ?? '—'}</span></div>
    <div class="kv"><span class="k">Reason</span><span class="v">${rec.reason ?? '—'}</span></div>
    <div class="kv"><span class="k">Received</span><span class="v">${new Date(rec.createdAt ?? Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span></div>
    <a class="cta" href="${process.env.SITE_URL ?? 'https://akeezo.com'}/admin/recommendations">View Recommendations →</a>
  `;

  return sendEmail({
    to,
    subject: `📍 New Recommendation: ${rec.targetName ?? 'Unknown'} (${rec.type ?? 'location'})`,
    html: shell('New City/Country Recommendation', body),
    text: `Recommendation for ${rec.targetName} (${rec.type}) by ${rec.name} (${rec.phone})`,
  });
}

// ─── 4. Daily/Weekly Digest Report ───────────────────────────────────────────
export async function sendDigestEmail({ leads = [], emergencies = [], blogs = [], period = 'Daily' }) {
  const to = getNotifyEmails();
  if (!to.length) return;

  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const leadRows = leads.slice(0, 20).map(l => `
    <tr>
      <td>${l.journeyId ?? l._id ?? '—'}</td>
      <td>${l.name ?? '—'}</td>
      <td>${l.phone ?? '—'}</td>
      <td>${l.country ?? '—'}</td>
      <td>${l.intent ?? '—'}</td>
      <td><span class="badge badge-${(l.status ?? 'new').toLowerCase()}">${l.status ?? 'New'}</span></td>
      <td>${new Date(l.createdAt ?? Date.now()).toLocaleDateString('en-IN')}</td>
    </tr>`).join('');

  const emergencyRows = emergencies.slice(0, 20).map(e => `
    <tr>
      <td>${e.caseId ?? '—'}</td>
      <td>${e.callerName ?? e.name ?? '—'}</td>
      <td>${e.callerPhone ?? e.phone ?? '—'}</td>
      <td>${e.problem ?? '—'}</td>
      <td>${e.location ?? '—'}</td>
      <td><span class="badge badge-${e.status === 'closed' ? 'converted' : 'emergency'}">${e.status ?? 'new'}</span></td>
      <td>${new Date(e.createdAt ?? Date.now()).toLocaleDateString('en-IN')}</td>
    </tr>`).join('');

  const activeLead = leads.filter(l => !l.status || ['New', 'Contacted', 'Qualified'].includes(l.status)).length;
  const converted  = leads.filter(l => l.status === 'Converted').length;
  const activeEmg  = emergencies.filter(e => !['closed', 'cancelled'].includes(e.status)).length;

  const body = `
    <p>Here is your <strong>${period} Digest</strong> for the AKEEZO platform as of <strong>${now}</strong>.</p>

    <div class="section-title">Summary</div>
    <div class="kv"><span class="k">Total Leads</span><span class="v">${leads.length}</span></div>
    <div class="kv"><span class="k">Active Leads</span><span class="v">${activeLead}</span></div>
    <div class="kv"><span class="k">Converted</span><span class="v">${converted}</span></div>
    <div class="kv"><span class="k">Total Emergencies</span><span class="v">${emergencies.length}</span></div>
    <div class="kv"><span class="k">Active Emergencies</span><span class="v">${activeEmg}</span></div>
    <div class="kv"><span class="k">Blog Posts</span><span class="v">${blogs.length} total, ${blogs.filter(b => b.status === 'Published').length} published</span></div>

    <div class="section-title">Recent Leads (up to 20)</div>
    <table class="data">
      <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Country</th><th>Intent</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${leadRows || '<tr><td colspan="7" style="color:#9ca3af;text-align:center;padding:16px;">No leads yet</td></tr>'}</tbody>
    </table>

    <div class="section-title">Recent Emergencies (up to 20)</div>
    <table class="data">
      <thead><tr><th>Case ID</th><th>Name</th><th>Phone</th><th>Problem</th><th>Location</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${emergencyRows || '<tr><td colspan="7" style="color:#9ca3af;text-align:center;padding:16px;">No emergencies</td></tr>'}</tbody>
    </table>

    <a class="cta" href="${process.env.SITE_URL ?? 'https://akeezo.com'}/admin/dashboard">Open Dashboard →</a>
  `;

  return sendEmail({
    to,
    subject: `📊 AKEEZO ${period} Digest — ${leads.length} Leads, ${emergencies.length} Emergencies`,
    html: shell(`${period} Platform Report`, body),
    text: `AKEEZO ${period} Digest | Leads: ${leads.length} | Emergencies: ${emergencies.length}`,
  });
}

// ─── 4. Test connection ───────────────────────────────────────────────────────
export async function testEmailConnection() {
  const transporter = getTransporter();
  if (!transporter) return { ok: false, reason: 'not_configured' };
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
