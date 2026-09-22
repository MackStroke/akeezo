/**
 * Single source of truth for contact details and content that appears in more
 * than one place (nav, footer, JSON-LD). Env-driven so staging and production
 * can point at different numbers without a code change.
 */
const env = import.meta.env;

export const site = {
  name: 'AKEEZO',
  legalName: 'AKEEZO Healthcare',
  url: env.VITE_SITE_URL ?? 'https://www.akeezo.com',
  tagline: 'Tell us what you need. We figure out the healthcare journey.',
  description:
    'AKEEZO coordinates healthcare journeys in India — medical tourism, 24/7 emergency assistance and home healthcare — from hospital and doctor options through travel, treatment and recovery at home.',

  emergencyPhone: env.VITE_EMERGENCY_PHONE ?? '+918287639443',
  whatsappNumber: env.VITE_WHATSAPP_NUMBER ?? '918287639443',
  email: env.VITE_CONTACT_EMAIL ?? 'care@akeezo.com',
  careEmail: 'care@akeezo.com',
  partnersEmail: 'partners@akeezo.com',
  medicalEmail: 'medical@akeezo.com',
};

/** Formats an E.164 number for display without changing the tel: target. */
export const formatPhone = (e164) => {
  const digits = e164.replace(/[^\d]/g, '');
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return e164;
};

export const telHref = (e164) => `tel:${e164.replace(/[^\d+]/g, '')}`;

export const whatsappHref = (message) =>
  `https://wa.me/${site.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;

/* --------------------------------------------------------------------------
 * Content
 * ----------------------------------------------------------------------- */

export const treatments = [
  { id: 'cardiac', label: 'Cardiac care', icon: 'heart' },
  { id: 'oncology', label: 'Cancer treatment', icon: 'ribbon' },
  { id: 'orthopaedics', label: 'Orthopaedics', icon: 'bone' },
  { id: 'neurology', label: 'Neurology & neurosurgery', icon: 'brain' },
  { id: 'transplant', label: 'Organ transplant', icon: 'organ' },
  { id: 'fertility', label: 'Fertility & IVF', icon: 'spark' },
  { id: 'second-opinion', label: 'Second opinion', icon: 'clipboard' },
  { id: 'dental', label: 'Dental', icon: 'tooth' },
  { id: 'cosmetic', label: 'Cosmetic & plastic surgery', icon: 'spark' },
  { id: 'diagnosis', label: 'Diagnosis & health checks', icon: 'stethoscope' },
];

export const cities = [
  'Delhi NCR',
  'Mumbai',
  'Chennai',
  'Hyderabad',
  'Bengaluru',
  'Kolkata',
  'Ahmedabad',
  'Kochi',
  'Jaipur',
  'Chandigarh',
];

export const navigation = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Hospitals',
    href: '/hospitals',
  },
  {
    label: 'Doctors',
    href: '/doctors',
  },
  {
    label: 'Services',
    megaMenu: true,
    groups: [
      {
        id: 'medical-tourism',
        label: 'Medical tourism',
        description: 'Complete healthcare journeys & treatment planning.',
        icon: 'Plane',
        href: '#plan',
        items: [
          { label: 'Find treatment', href: '#treatments' },
          { label: 'Find a hospital', href: '/hospitals' },
          { label: 'Find a doctor', href: '#plan' },
          { label: 'Treatment cost estimate', href: '#cost' },
          { label: 'International patients', href: '#plan' },
          { label: 'The patient journey', href: '#journey' },
        ],
      },
      {
        id: 'emergency',
        label: 'Emergency',
        description: '24/7 urgent assistance and coordination.',
        icon: 'Ambulance',
        href: '#emergency',
        items: [
          { label: 'Emergency assistance', href: '#emergency' },
          { label: 'Ambulance coordination', href: '#emergency' },
          { label: 'Hospital coordination', href: '#emergency' },
          { label: 'Travel & tourist emergencies', href: '#emergency' },
        ],
      },
      {
        id: 'home-healthcare',
        label: 'Home healthcare',
        description: 'Professional care and support at home.',
        icon: 'Home',
        href: '#home-care',
        items: [
          { label: 'Nurses', href: '#home-care' },
          { label: 'Caregivers & attendants', href: '#home-care' },
          { label: 'Physiotherapy', href: '#home-care' },
          { label: 'Doctor home visits', href: '#home-care' },
          { label: 'Post-operative care', href: '#home-care' },
          { label: 'Elder care', href: '#home-care' },
        ],
      }
    ]
  },
  {
    label: 'For partners',
    href: '#partners',
    items: [
      { label: 'Hospitals', href: '#partners' },
      { label: 'International agents', href: '#partners' },
      { label: 'Hotels', href: '#partners' },
      { label: 'Corporates', href: '#partners' },
      { label: 'Insurance & TPAs', href: '#partners' },
      { label: 'Embassies', href: '#partners' },
    ],
  },
];

export const faqs = [
  {
    q: 'What does AKEEZO actually do?',
    a: 'AKEEZO coordinates the whole healthcare journey rather than selling one service. You tell us the medical requirements, with your budget, and share the suitable hospitals and doctors, an itemised cost estimate, an expected timeline, and- if you need- travel, visa documentation, accommodation, transport, an attendant and post-treatment care at home.',
  },
  {
    q: 'How much does it cost to use AKEEZO?',
    a: 'Getting hospital options, doctor options and a treatment estimate costs you nothing. You pay hospitals, doctors and service providers directly for the care and services you choose. Any AKEEZO coordination fee is stated in writing before you commit to anything.',
  },
  {
    q: 'Are the treatment estimates accurate?',
    a: 'They are estimates, not quotations. Figures are based on the hospital tariffs and typical care pathways for the treatment you describe, and they cover the journey — treatment, doctor, diagnostics, medicines, stay, transport and attendant support. The final cost depends on medical evaluation on arrival and is confirmed by the hospital.',
  },
  {
    q: 'How do you choose which hospital and doctor to recommend?',
    a: 'Recommendations are driven by what you tell us matters: clinical suitability for your diagnosis, the specialist experience available, accreditation such as NABH or JCI, cost, the city, expected length of stay, and language support. You always see more than one option side by side and you make the final choice.',
  },
  {
    q: 'Can you help with a medical visa and an invitation letter?',
    a: 'Yes. We guide you through medical visa documentation and coordinate hospital invitation letters where the hospital issues them. AKEEZO is not a visa authority and cannot guarantee a visa outcome — the decision always rests with the issuing mission.',
  },
  {
    q: 'What happens in an emergency — how fast is it?',
    a: 'The emergency flow asks four short questions: where the patient is, what happened, what help you think is needed, and a number to call you back on. The request lands on the AKEEZO Emergency Control Desk immediately and a coordinator calls you. If someone is unconscious or not breathing, call the emergency number on screen instead of filling in a form.',
  },
  {
    q: 'Do you support patients who are not in India yet?',
    a: 'Yes- we do support. We work with patients and families across the globe e.g Africa, the Middle East, Central Asia, South Asia and the CIS, with support in major languages English, Hindi, Arabic, French, Swahili, Russian and several other languages.',
  },
  {
    q: 'What happens to my medical reports?',
    a: 'Reports you share are used only to understand your requirement and to get hospital and doctor opinions on your behalf, and are shared only with the providers involved in your care. You can ask us to delete them at any time.',
  },
];
