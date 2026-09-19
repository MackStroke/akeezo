import { useState, useEffect, useCallback } from 'react';
import {
  Mail, Send, CheckCircle2, XCircle, RefreshCw,
  Settings, AlertTriangle, Download, Siren, Users, BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

function StatusDot({ ok }) {
  return (
    <span className={cn(
      'inline-block size-2.5 rounded-full shrink-0',
      ok ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500',
    )} />
  );
}

export default function AdminEmailPage() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  const token = () => localStorage.getItem('adminToken');

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email/status', {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const json = await res.json();
      if (json.ok) setStatus(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleTest = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/admin/email/test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const json = await res.json();
      if (json.ok) showToast('success', json.message);
      else showToast('error', json.error ?? 'Test failed');
    } catch {
      showToast('error', 'Request failed');
    } finally {
      setTesting(false);
    }
  };

  const handleDigest = async (period) => {
    setSending(true);
    try {
      const res = await fetch('/api/admin/email/digest', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ period }),
      });
      const json = await res.json();
      if (json.ok) showToast('success', json.message + ` (${json.counts?.leads ?? 0} leads, ${json.counts?.emergencies ?? 0} emergencies)`);
      else showToast('error', json.error ?? 'Failed to send digest');
    } catch {
      showToast('error', 'Request failed');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-ink-strong">Email Notifications</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure and manage automated email alerts for leads, emergencies, and digest reports.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={fetchStatus}>
          <RefreshCw className="size-3.5" /> Refresh
        </Button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl border font-semibold text-sm',
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200'
            : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-200',
        )}>
          {toast.type === 'success'
            ? <CheckCircle2 className="size-4 shrink-0" />
            : <XCircle className="size-4 shrink-0" />
          }
          {toast.msg}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-48 bg-muted rounded-xl" />
        </div>
      ) : (
        <>
          {/* Status Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Mail className="size-4 text-primary" /> SMTP Configuration
                  </CardTitle>
                  {status?.configured
                    ? <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">Configured</Badge>
                    : <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold">Not Set Up</Badge>
                  }
                </div>
                <CardDescription>Current email server settings from environment variables.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'SMTP Host', value: status?.host ?? '—', env: 'EMAIL_HOST' },
                  { label: 'Sender', value: status?.user ?? '—', env: 'EMAIL_USER' },
                  { label: 'Recipients', value: status?.recipients?.join(', ') || '—', env: 'NOTIFY_EMAIL' },
                ].map(({ label, value, env }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                      <p className="text-sm font-mono font-medium mt-0.5 break-all">{value}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">{env}</Badge>
                  </div>
                ))}

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <StatusDot ok={status?.connected} />
                    <span className="text-sm font-semibold">
                      {status?.connected ? 'SMTP connection verified' : 'Not connected'}
                    </span>
                  </div>
                  {status?.error && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="size-3" /> {status.error}
                    </p>
                  )}
                </div>

                {!status?.configured && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-bold mb-1">Add these to your <code>.env</code> file:</p>
                    <pre className="font-mono leading-5 whitespace-pre-wrap">{`EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=you@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="AKEEZO Alerts <you@gmail.com>"
NOTIFY_EMAIL=admin@akeezo.com`}</pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Settings className="size-4 text-primary" /> Actions
                </CardTitle>
                <CardDescription>Test your email setup or send a report on demand.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Auto-trigger status */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Auto Notifications</p>
                  {[
                    { label: 'New Lead Submitted', icon: Users, ok: status?.notificationsEnabled?.newLead },
                    { label: 'Emergency SOS Received', icon: Siren, ok: status?.notificationsEnabled?.newEmergency },
                  ].map(({ label, icon: Icon, ok }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Icon className="size-4 text-primary" />
                        {label}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusDot ok={ok} />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {ok ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Manual Actions</p>

                  <Button
                    className="w-full gap-2 font-bold"
                    variant="outline"
                    onClick={handleTest}
                    disabled={testing || !status?.configured}
                  >
                    {testing
                      ? <><RefreshCw className="size-4 animate-spin" /> Sending Test…</>
                      : <><Send className="size-4" /> Send Test Email</>
                    }
                  </Button>

                  <Button
                    className="w-full gap-2 font-bold"
                    onClick={() => handleDigest('Manual')}
                    disabled={sending || !status?.configured}
                  >
                    {sending
                      ? <><RefreshCw className="size-4 animate-spin" /> Sending Digest…</>
                      : <><Download className="size-4" /> Send Full Digest Report</>
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Digest breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="size-4 text-primary" /> What's included in the Digest Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Users,
                    title: 'All Leads',
                    desc: 'Journey ID, name, phone, country, intent, status, and date for every lead in the database (up to 20 in the email, full count in summary).',
                  },
                  {
                    icon: Siren,
                    title: 'All Emergencies',
                    desc: 'Case ID, caller name, phone, problem description, location, status, and date for every SOS case.',
                    emergency: true,
                  },
                  {
                    icon: BookOpen,
                    title: 'Blog Overview',
                    desc: 'Total blog posts, published vs draft count, and total view count across all articles.',
                  },
                ].map(({ icon: Icon, title, desc, emergency }) => (
                  <div key={title} className={cn(
                    'rounded-xl border p-4',
                    emergency && 'border-emergency/20 bg-emergency-surface',
                  )}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn('size-4', emergency ? 'text-emergency' : 'text-primary')} />
                      <span className="font-bold text-sm">{title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Setup guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Gmail Quick Setup Guide</CardTitle>
              <CardDescription>Using Gmail is the easiest way to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                {[
                  'Go to your Google Account → Security → 2-Step Verification (must be ON).',
                  'Under 2-Step Verification, scroll to "App passwords" and create one for "Mail".',
                  'Copy the 16-character app password (spaces don\'t matter).',
                  'Add the following variables to your server <code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">.env</code> file:',
                  'Restart the server — no code changes needed.',
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="size-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span
                      className="text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step }}
                    />
                  </li>
                ))}
              </ol>
              <pre className="mt-4 p-4 bg-muted rounded-xl text-xs font-mono leading-6 overflow-x-auto">{`EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=youraddress@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM="AKEEZO Platform <youraddress@gmail.com>"
NOTIFY_EMAIL=admin@yourcompany.com,ops@yourcompany.com`}</pre>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
