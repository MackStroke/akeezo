import { Router } from 'express';
import { find, FILES } from '../utils/store.js';
import { Lead } from '../models/Lead.js';
import { EmergencyRequest } from '../models/EmergencyRequest.js';
import { Blog } from '../models/Blog.js';
import {
  sendDigestEmail,
  testEmailConnection,
  getNotifyEmails,
} from '../services/email.js';

const router = Router();

// GET /api/admin/email/status — check config + connection
router.get('/status', async (req, res) => {
  const configured = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
  const recipients = getNotifyEmails();

  let connected = false;
  let error = null;
  if (configured) {
    const result = await testEmailConnection();
    connected = result.ok;
    error = result.error ?? null;
  }

  res.json({
    ok: true,
    data: {
      configured,
      connected,
      error,
      host: process.env.EMAIL_HOST ?? null,
      user: process.env.EMAIL_USER ?? null,
      recipients,
      notificationsEnabled: {
        newLead: configured,
        newEmergency: configured,
      },
    },
  });
});

// POST /api/admin/email/test — send a test email to NOTIFY_EMAIL
router.post('/test', async (req, res) => {
  const result = await testEmailConnection();
  if (!result.ok) {
    return res.status(400).json({ ok: false, error: result.error ?? result.reason });
  }

  const { sendEmail, getNotifyEmails } = await import('../services/email.js');
  const to = getNotifyEmails();
  if (!to.length) {
    return res.status(400).json({ ok: false, error: 'NOTIFY_EMAIL not configured' });
  }

  const sent = await sendEmail({
    to,
    subject: '✅ AKEEZO — Email Test Successful',
    html: `<p style="font-family:sans-serif;padding:24px;">
      <strong>🎉 Test email from AKEEZO Platform</strong><br/><br/>
      Your email notifications are configured correctly.<br/>
      You will receive alerts for new leads and emergency SOS requests at this address.
    </p>`,
    text: 'AKEEZO email test — configuration is working correctly.',
  });

  if (sent.ok) {
    res.json({ ok: true, message: `Test email sent to ${to.join(', ')}` });
  } else {
    res.status(500).json({ ok: false, error: sent.error });
  }
});

// POST /api/admin/email/digest — send a full digest report now
router.post('/digest', async (req, res) => {
  try {
    const { period = 'Manual' } = req.body;

    const [leads, emergencies] = await Promise.all([
      find(Lead, FILES.leads),
      find(EmergencyRequest, FILES.emergency),
    ]);

    let blogs = [];
    try { blogs = await Blog.find().lean(); } catch (_) {}

    const result = await sendDigestEmail({ leads, emergencies, blogs, period });

    if (!result) {
      return res.status(400).json({ ok: false, error: 'Email not configured. Set EMAIL_HOST, EMAIL_USER, EMAIL_PASS, NOTIFY_EMAIL in your environment.' });
    }
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.error ?? result.reason });
    }

    res.json({
      ok: true,
      message: `Digest sent to ${getNotifyEmails().join(', ')}`,
      counts: { leads: leads.length, emergencies: emergencies.length, blogs: blogs.length },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
