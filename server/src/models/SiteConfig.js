import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    maintenancePages: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    countries: { type: [String], default: [] },
    gtmId: { type: String, default: '' },
    googleSiteVerification: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);
