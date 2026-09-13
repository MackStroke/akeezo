import { LegalLayout } from '@/components/legal/LegalLayout';
import { ShieldAlert, CheckCircle2, Lock, FileText, Globe, Key } from 'lucide-react';

const TOC = [
  { id: 'sec-1', title: '1. Scope & Global Regulatory Compliance' },
  { id: 'sec-2', title: '2. Categories of Information We Collect' },
  { id: 'sec-3', title: '3. Lawful Basis for Health Data Processing' },
  { id: 'sec-4', title: '4. Cross-Border Transfers & Hospital Sharing' },
  { id: 'sec-5', title: '5. Technical Safeguards & Encryption Standards' },
  { id: 'sec-6', title: '6. Data Retention & Destruction Policies' },
  { id: 'sec-7', title: '7. Your Global Data Subject Rights' },
  { id: 'sec-8', title: '8. Data Protection Officer (DPO) Contact' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Global Privacy Policy & Health Data Protection"
      subtitle="Comprehensive data governance framework abiding by EU GDPR, US HIPAA/HITECH, UK DPA, India DPDP Act 2023, and global healthcare privacy mandates."
      category="Privacy & Protection"
      lastUpdated="September 13, 2026"
      toc={TOC}
    >
      <div className="space-y-8 text-foreground">
        
        {/* Intro Highlight Box */}
        <div className="rounded-xl border border-primary/20 bg-accent/30 p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-primary text-sm uppercase tracking-wider">
            <Lock className="size-4" /> Policy Summary & Trust Commitment
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            AKEEZO Healthcare Platform ("AKEEZO", "we", "us", or "our") respects your fundamental right to privacy. Because our care coordination services involve processing highly sensitive Protected Health Information (PHI), medical diagnostics, and personal identifiers across international borders, this Privacy Policy outlines how we safeguard your data in strict compliance with applicable global regulations.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-1" className="space-y-3 pt-2">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Globe className="size-5 text-primary shrink-0" />
            1. Scope & Global Regulatory Compliance
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This Privacy Policy applies universally to all patients, guardians, medical attendants, healthcare partners, and website visitors accessing AKEEZO services. We explicitly align our data governance practices with the following global legal standards:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
              <strong className="text-ink-strong font-bold block">EU & UK GDPR (Regulation 2016/679)</strong>
              <p className="text-muted-foreground">Enforcing strict Article 6 & Article 9 protocols for processing special categories of health data and international data transfer safeguards.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
              <strong className="text-ink-strong font-bold block">US HIPAA & HITECH Act</strong>
              <p className="text-muted-foreground">Implementing Administrative, Physical, and Technical Safeguards for Protected Health Information (PHI) confidentiality.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
              <strong className="text-ink-strong font-bold block">India DPDP Act 2023</strong>
              <p className="text-muted-foreground">Fulfilling obligations of Data Fiduciaries, explicit consent mandates, and Data Principal rights for Indian and international residents.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-border bg-muted/40 text-xs space-y-1">
              <strong className="text-ink-strong font-bold block">Global Health Data Directives</strong>
              <p className="text-muted-foreground">Abiding by Kenya DPA 2019, UAE Health Data Law (Federal Law No. 2 of 2019), and SADC Data Protection Frameworks.</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section id="sec-2" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            2. Categories of Information We Collect
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We only collect personal and health information strictly necessary to fulfill your requested medical journey, treatment plan, emergency response, or home healthcare coordination.
          </p>
          <ul className="space-y-3 pt-2 text-xs sm:text-sm text-foreground/90">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">Personal Identification Data:</strong> Full legal name, date of birth, passport/national identity number, nationality, residential address, telephone number, and emergency contact details.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">Special Category Protected Health Information (PHI):</strong> Diagnostic imaging files (DICOM, MRI, CT scans), laboratory blood reports, pathology findings, previous surgical notes, attending physician opinions, prescription records, current medications, known allergies, and clinical history.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">Logistics & Travel Documentation:</strong> Flight itineraries, visa invitation letters, hotel/serviced apartment accommodation preferences, and medical escort requirement logs.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">Technical & Usage Telemetry:</strong> IP addresses, browser types, device identifiers, session timestamps, and cookies necessary for portal security.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="sec-3" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            3. Lawful Basis for Health Data Processing
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Under GDPR Article 6 & 9 and DPDP Section 6, AKEEZO relies on the following lawful bases to process your information:
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-primary font-bold">Explicit Informed Consent (Art. 9(2)(a)):</strong> You provide explicit written consent prior to uploading medical files or initiating case reviews for cross-border hospital evaluation.
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-primary font-bold">Performance of Contract (Art. 6(1)(b)):</strong> Processing is necessary to execute care coordination, issue hospital estimates, and organize logistics requested by you.
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-primary font-bold">Vital Interests & Emergency Triage (Art. 9(2)(c)):</strong> During acute medical emergencies, we process critical health data to dispatch life-saving ambulance transport and inform receiving emergency departments.
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section id="sec-4" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            4. Cross-Border Transfers & Hospital Sharing
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To provide medical travel coordination in India and international hubs, your medical records may be transmitted across national borders. We enforce strict data transfer controls:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Accredited Partner Hospitals:</strong> Shared exclusively with JCI (Joint Commission International) and NABH (National Accreditation Board for Hospitals) accredited institutions evaluating your specific clinical case.</li>
            <li><strong className="text-foreground">Standard Contractual Clauses (SCCs):</strong> International data transfers are executed under EU Standard Contractual Clauses and Data Transfer Agreements containing strict confidentiality obligations.</li>
            <li><strong className="text-foreground">No Sale of Personal Data:</strong> AKEEZO never sells, rents, monetizes, or trades your personal or health data to third-party advertisers, insurance brokers, or data brokers.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="sec-5" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Key className="size-5 text-primary shrink-0" />
            5. Technical Safeguards & Encryption Standards
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We implement defense-in-depth security measures to protect against unauthorized access, data alteration, disclosure, or destruction:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-center space-y-1">
              <span className="font-bold text-ink-strong block">In-Transit Encryption</span>
              <p className="text-muted-foreground">TLS 1.3 cryptographic protocols for all web traffic and document transmissions.</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-center space-y-1">
              <span className="font-bold text-ink-strong block">At-Rest Encryption</span>
              <p className="text-muted-foreground">AES-256 bit hardware-level encryption for database fields and DICOM scan vaults.</p>
            </div>
            <div className="p-3 rounded-lg border border-border bg-muted/30 text-center space-y-1">
              <span className="font-bold text-ink-strong block">Zero-Trust Access</span>
              <p className="text-muted-foreground">Role-based access control (RBAC), multi-factor authentication, and immutable audit logs.</p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="sec-6" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            6. Data Retention & Destruction Policies
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Personal health data is retained only for as long as necessary to complete your healthcare journey and fulfill statutory medical record holding periods mandated by National Medical Commissions (typically 10 years for hospital records). Upon expiration of statutory periods or valid consent revocation, files are securely shredded using DoD 5220.22-M sanitization standards.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-7" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            7. Your Global Data Subject Rights
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Regardless of your geographic location, AKEEZO grants you full control over your personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-border rounded-lg">
              <strong className="text-ink-strong font-bold block">Right to Access (SAR)</strong>
              <span className="text-muted-foreground">Request a machine-readable copy of all personal and medical files held by AKEEZO.</span>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <strong className="text-ink-strong font-bold block">Right to Rectification</strong>
              <span className="text-muted-foreground">Correct inaccurate or outdated contact, diagnostic, or personal information.</span>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <strong className="text-ink-strong font-bold block">Right to Erasure ("To Be Forgotten")</strong>
              <span className="text-muted-foreground">Request permanent deletion of your data, subject to legal medical hold requirements.</span>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <strong className="text-ink-strong font-bold block">Right to Withdraw Consent</strong>
              <span className="text-muted-foreground">Revoke authorization for further data processing or hospital sharing at any time.</span>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section id="sec-8" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            8. Data Protection Officer (DPO) Contact
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For data protection inquiries, Subject Access Requests (SAR), or privacy complaints, please contact our Data Protection Officer:
          </p>
          <div className="p-4 rounded-xl border border-primary/30 bg-card text-xs space-y-1.5">
            <p className="font-bold text-ink-strong text-sm">Data Protection Officer (DPO)</p>
            <p className="text-muted-foreground">AKEEZO Healthcare Platform Private Limited</p>
            <p className="text-muted-foreground">Email: <a href="mailto:dpo@akeezo.com" className="font-bold text-primary underline">dpo@akeezo.com</a></p>
            <p className="text-muted-foreground">Direct Desk: <a href="tel:+918287639443" className="font-bold text-primary underline">+91 82876 39443</a></p>
            <p className="text-muted-foreground text-[0.7rem] pt-1">Response SLA: All formal privacy requests receive an official response within 72 business hours.</p>
          </div>
        </section>

      </div>
    </LegalLayout>
  );
}
