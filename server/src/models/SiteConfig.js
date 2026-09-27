import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    maintenancePages: { type: [String], default: [] },
    cities: { type: [String], default: [] },
    countries: { type: [String], default: [] },
    gtmId: { type: String, default: '' },
    googleSiteVerification: { type: String, default: '' },
    homeServices: { type: [String], default: ['Nurse', 'Caregiver / attendant', 'Physiotherapist', 'Doctor home visit', 'Post-operative care', 'Elder care', 'Palliative care', 'Home diagnostics'] },
    emergencyPlaceTypes: { type: [String], default: ['Home', 'Hotel', 'Airport', 'Railway station', 'Office', 'Road / in transit', 'Somewhere else'] },
    emergencyProblems: { type: [String], default: ['Accident', 'Chest pain', 'Difficulty breathing', 'Unconscious', 'Severe bleeding', 'Stroke symptoms', 'Seizure', 'Severe allergic reaction', 'Burn', 'Poisoning', 'Pregnancy-related emergency', 'Fall or injury', 'Fever or illness', 'Other', "I don't know"] },
    planTreatments: [
      {
        id: String,
        label: String,
        icon: String
      }
    ],
    planTimelines: { type: [String], default: [] },
    homeDurations: { type: [String], default: [] },
    medicinesNeedTypes: { type: [String], default: [] },
    medicinesContent: {
      heroTitle: { type: String, default: 'Medicines & Supplements' },
      heroSubtitle: { type: String, default: 'Upload your prescription or let us know what you need. Our executive will reach out to you to confirm your order and arrange delivery.' },
      banners: [
        {
          id: String,
          imageUrl: String,
          title: String,
          link: String,
          active: Boolean
        }
      ],
      offers: [
        {
          id: String,
          title: String,
          description: String,
          code: String,
          active: Boolean
        }
      ]
    },
    homeContent: {
      whyUsTitle: { type: String, default: 'Why Us' },
      whyUsDescription: { type: String, default: 'Akeezo is your trusted home care partner which helps you experience the best medical care in the comfort of your home. We understand you and ensure the highest standard of personalized healthcare at your doorstep.' },
      whyUsCards: [
        {
          id: String,
          text: String,
          svgContent: String
        }
      ]
    },
  },
  { timestamps: true }
);

export const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);
