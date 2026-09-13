import { useState } from 'react';
import {
  Save,
  RotateCcw,
  CheckCircle2,
  Share2,
  Globe,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { getSocialLinks, saveSocialLinks, DEFAULT_SOCIAL_LINKS } from '@/lib/socialStore';

export default function SocialSettingsPage() {
  const [links, setLinks] = useState(getSocialLinks);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUrlChange = (id, newUrl) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url: newUrl } : item))
    );
  };

  const handleToggle = (id) => {
    setLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveSocialLinks(links);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all social links to default configuration?')) {
      setLinks(DEFAULT_SOCIAL_LINKS);
      saveSocialLinks(DEFAULT_SOCIAL_LINKS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="size-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink-strong">
              Social Media Links
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage official social media profiles displayed in the platform footer & contact cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rule bg-card hover:bg-muted text-foreground text-xs font-bold transition-all shadow-xs"
          >
            <RotateCcw className="size-3.5" /> Reset Default
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-bold text-xs sm:text-sm transition-all"
          >
            <Save className="size-4" /> Save Configuration
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-700 dark:text-emerald-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>Social media configuration updated successfully and published to website footer!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div className="bg-card rounded-[1.25rem] border border-rule/80 shadow-sm p-5 sm:p-7">
          <h2 className="text-base font-extrabold text-ink-strong mb-5 flex items-center justify-between">
            <span>Configured Platforms</span>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              {links.filter((l) => l.enabled).length} Active
            </span>
          </h2>

          <div className="divide-y divide-rule/60">
            {links.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-[11rem]">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleToggle(item.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className={`font-bold text-sm ${item.enabled ? 'text-ink-strong' : 'text-muted-foreground line-through'}`}>
                    {item.name}
                  </span>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleUrlChange(item.id, e.target.value)}
                    disabled={!item.enabled}
                    placeholder={`https://${item.id}.com/yourhandle`}
                    className="w-full bg-slate-50 dark:bg-muted/40 border border-rule/70 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                  />
                  {item.url && item.enabled && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-accent text-primary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0"
                      title={`Preview ${item.name}`}
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
