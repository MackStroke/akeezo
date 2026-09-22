import { LegalLayout } from '@/components/legal/LegalLayout';
import { FileCheck, ShieldCheck, Globe, Video, UserCheck, AlertCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const TOC = [
  { id: 'sec-1', title: '1. Express Informed Consent Framework' },
  { id: 'sec-2', title: '2. Authorization for Medical Record Review' },
  { id: 'sec-3', title: '3. Cross-Border PHI Transfer Agreement' },
  { id: 'sec-4', title: '4. Tele-Consultation & Remote Evaluation' },
  { id: 'sec-5', title: '5. Emergency Disclosure Authorization' },
  { id: 'sec-6', title: '6. Legal Guardian & Proxy Sign-Off' },
  { id: 'sec-7', title: '7. Revocation Protocol & Consent Withdrawal' },
];

export default function PatientConsentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Patient Consent | AKEEZO',
    url: 'https://www.akeezo.com/consent',
    description: 'AKEEZO Patient Consent Form. Authorization for medical record review and cross-border transfer.'
  };

  return (
    <>
      <SEO 
        title="Patient Consent"
        description="AKEEZO Patient Consent Form. Authorization for medical record review and cross-border transfer."
        canonical="/consent"
        jsonLd={jsonLd}
        keywords="AKEEZO Patient Consent, Medical Record Authorization, PHI Transfer, Healthcare Consent Form"
      />
    <LegalLayout
      title="Patient Data & Medical Consent Framework"
      subtitle="Formal informed consent protocol governing health record handling, cross-border hospital transmission, tele-consultations, and medical proxy authorization."
      category="Patient Consent"
      lastUpdated="September 13, 2026"
      toc={TOC}
    >
      <div className="space-y-8 text-foreground">
        
        {/* Intro Callout */}
        <div className="rounded-xl border border-primary/30 bg-accent/40 p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-primary text-sm uppercase tracking-wider">
            <FileCheck className="size-4" /> Patient Consent Commitment
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            By registering a healthcare inquiry, submitting medical scans, or authorizing an international treatment journey with AKEEZO, you provide your voluntary, explicit informed consent for the processing, translation, and cross-border transmission of your Protected Health Information (PHI).
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-1" className="space-y-3 pt-2">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary shrink-0" />
            1. Express Informed Consent Framework
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In accordance with GDPR Article 9(2)(a), US HIPAA Privacy Standards (45 CFR § 164.508), and the India Digital Personal Data Protection Act 2023, AKEEZO processes special categories of personal health data solely under your express written authorization. You confirm that you have been fully informed regarding the purpose, scope, and destination of your health data.
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-2" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            2. Authorization for Medical Record Review
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You grant AKEEZO explicit permission to perform the following actions with your medical files:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/90">
            <li className="flex items-start gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold mt-0.5">1</span>
              <span><strong>Ingest & Store:</strong> Securely upload, index, and store medical records, DICOM radiology files, blood reports, and surgical histories in encrypted cloud vaults.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold mt-0.5">2</span>
              <span><strong>Medical Translation:</strong> Translate non-English medical reports into English or host country clinical terminology required for specialist evaluation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary text-xs font-bold mt-0.5">3</span>
              <span><strong>Multi-Specialty Board Presentation:</strong> Share case records with medical review boards at JCI and NABH accredited partner hospitals for opinion generation.</span>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="sec-3" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Globe className="size-5 text-primary shrink-0" />
            3. Cross-Border PHI Transfer Agreement
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Because medical tourism and specialist consultations require evaluating records internationally, you expressly consent to the cross-border transmission of your health data from your country of residence to accredited hospitals in India, UAE, and destination medical hubs. All transfers execute under TLS 1.3 encryption and Standard Contractual Clauses (SCCs).
          </p>
        </section>

        {/* Section 4 */}
        <section id="sec-4" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Video className="size-5 text-primary shrink-0" />
            4. Tele-Consultation & Remote Evaluation
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you participate in pre-travel video consultations or remote medical evaluations facilitated by AKEEZO:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-muted-foreground space-y-1.5">
            <li>You acknowledge that remote evaluation cannot completely replace physical in-person examination.</li>
            <li>You consent to secure audio-video recording of clinical sessions for medical quality assurance and record keeping.</li>
            <li>You agree that treating doctors reserve the right to require physical re-examination upon hospital arrival.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="sec-5" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            5. Emergency Disclosure Authorization
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In acute emergency situations where you are unresponsive or physically incapacitated, you authorize AKEEZO emergency desk staff to share vital blood type, allergy, and critical diagnostic history with attending paramedics, ambulance teams, and receiving hospital trauma units to preserve life.
          </p>
        </section>

        {/* Section 6 */}
        <section id="sec-6" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <UserCheck className="size-5 text-primary shrink-0" />
            6. Legal Guardian & Proxy Sign-Off
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If submitting records on behalf of a minor child, elderly parent, or legally incapacitated family member, you represent and warrant that you hold legal guardianship, power of attorney, or statutory authorization to grant medical consent on their behalf.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-7" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <AlertCircle className="size-5 text-primary shrink-0" />
            7. Revocation Protocol & Consent Withdrawal
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You retain the absolute right to revoke or withdraw your consent at any time without penalty. Consent revocation can be initiated by emailing <a href="mailto:consent@akeezo.com" className="font-bold text-primary underline">consent@akeezo.com</a>. Upon receipt, further hospital sharing will cease immediately, though prior processing executed while consent was valid remains legally sound.
          </p>
        </section>

      </div>
    </LegalLayout>
    </>
  );
}
