import { LegalLayout } from '@/components/legal/LegalLayout';
import { FileText, AlertOctagon, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

const TOC = [
  { id: 'sec-1', title: '1. Agreement & Acceptance of Terms' },
  { id: 'sec-2', title: '2. Platform Facilitation Role (Non-Clinical)' },
  { id: 'sec-3', title: '3. User Obligations & Record Accuracy' },
  { id: 'sec-4', title: '4. Financial Estimates & Direct Hospital Billing' },
  { id: 'sec-5', title: '5. Travel, Visa & Concierge Logistics' },
  { id: 'sec-6', title: '6. Emergency Intake Protocol Limitations' },
  { id: 'sec-7', title: '7. Intellectual Property Rights' },
  { id: 'sec-8', title: '8. Limitation of Liability & Indemnification' },
  { id: 'sec-9', title: '9. Governing Law & Dispute Resolution' },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service & Platform Facilitation Agreement"
      subtitle="Legal terms governing access to AKEEZO healthcare journey coordination, medical tourism logistics, cost estimates, and emergency intake services."
      category="Terms of Service"
      lastUpdated="September 13, 2026"
      toc={TOC}
    >
      <div className="space-y-8 text-foreground">
        
        {/* Intro Alert Box */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-amber-600 dark:text-amber-400 text-sm uppercase tracking-wider">
            <AlertOctagon className="size-4" /> Essential Notice to Patients & Users
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            Please read these Terms of Service carefully before accessing or using the AKEEZO Healthcare Platform. By submitting an inquiry, requesting a cost estimate, uploading diagnostic records, or registering an account, you agree to be bound by these legal terms and conditions.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-1" className="space-y-3 pt-2">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            1. Agreement & Acceptance of Terms
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This binding agreement is entered into between you ("User", "Patient", or "Guardian") and AKEEZO Healthcare Platform Private Limited ("AKEEZO", "we", "our"). These Terms apply to all website features, mobile interfaces, tele-consultation facilitation, cost estimation engines, and concierge services provided by AKEEZO. If you do not agree to these terms, you must refrain from using our services.
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-2" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Scale className="size-5 text-primary shrink-0" />
            2. Platform Facilitation Role (Non-Clinical)
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AKEEZO functions strictly as an independent healthcare journey coordination and medical tourism facilitation platform. It is vital to understand the boundary of our services:
          </p>
          <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/90">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">No Practice of Medicine:</strong> AKEEZO is not a hospital, medical clinic, or licensed healthcare provider. AKEEZO does not employ treating physicians, does not diagnose medical conditions, and does not prescribe pharmaceuticals.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">Independent Healthcare Institutions:</strong> All medical evaluations, surgical procedures, doctor opinions, and hospital admissions are conducted independently by JCI/NABH accredited third-party hospitals and licensed physicians.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink-strong font-bold">No Doctor-Patient Privilege:</strong> Communicating with an AKEEZO care coordinator does not establish a clinical doctor-patient relationship.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section id="sec-3" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            3. User Obligations & Record Accuracy
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To ensure safe clinical evaluation by host hospital specialists, you agree to:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-muted-foreground space-y-2">
            <li>Provide accurate, complete, and un-altered medical reports, DICOM scans, pathology results, and clinical history.</li>
            <li>Maintain the confidentiality of your AKEEZO patient account credentials.</li>
            <li>Refrain from uploading corrupt files, malicious code, or fraudulent identity documents.</li>
            <li>Ensure you possess legal authority or power of attorney if acting as a guardian or proxy for a family member.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="sec-4" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            4. Financial Estimates & Direct Hospital Billing
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Financial clarity is a cornerstone of AKEEZO. However, financial terms are defined as follows:
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-ink-strong font-bold">Estimates vs. Binding Quotes:</strong> All cost figures displayed or issued by AKEEZO are non-binding pre-admission estimates based on preliminary records. Final medical bills are determined exclusively by host hospitals following in-person clinical assessment.
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-ink-strong font-bold">Direct Medical Billing:</strong> Medical treatment, surgical procedures, ICU stays, and hospital pharmacy charges are billed directly by the host hospital. AKEEZO does not mark up hospital surgical fees.
            </div>
            <div className="p-3 border border-border rounded-lg bg-card">
              <strong className="text-ink-strong font-bold">Cancellation & Refunds:</strong> Concierge travel, accommodation, and private medical escort bookings are subject to third-party vendor cancellation policies as outlined prior to booking.
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section id="sec-5" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            5. Travel, Visa & Concierge Logistics
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AKEEZO assists international patients with official Medical Visa invitation letters issued directly by accredited host hospitals. However, visa issuance rests solely under the sovereign discretion of relevant Embassies and Consulates. AKEEZO assumes no liability for government visa denials or flight delays.
          </p>
        </section>

        {/* Section 6 */}
        <section id="sec-6" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <ShieldAlert className="size-5 text-emergency shrink-0" />
            6. Emergency Intake Protocol Limitations
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The AKEEZO Emergency Form is a rapid intake concierge dispatch service designed to coordinate ground ambulances and identify receiving hospital emergency beds. It is NOT an automated replacement for municipal emergency services. In immediate life-threatening situations, always dial local municipal emergency dispatches (e.g., 112, 911, 102) simultaneously.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-7" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            7. Intellectual Property Rights
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All site content, visual designs, brand assets, software code, cost estimation logic, interactive care widgets, and trade names are the exclusive intellectual property of AKEEZO Healthcare Platform Private Limited and protected under international copyright and trademark laws.
          </p>
        </section>

        {/* Section 8 */}
        <section id="sec-8" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            8. Limitation of Liability & Indemnification
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the maximum extent permitted under applicable law, AKEEZO, its directors, employees, and logistics partners shall not be liable for any indirect, incidental, consequential, or punitive damages arising from medical treatment outcomes, hospital negligence, physician malpractice, or third-party service delays. You agree to indemnify and hold harmless AKEEZO against any third-party claims resulting from your breach of these Terms.
          </p>
        </section>

        {/* Section 9 */}
        <section id="sec-9" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            9. Governing Law & Dispute Resolution
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute or claim arising out of or in connection with these Terms shall be settled by binding arbitration in accordance with the Arbitration and Conciliation Act, 1996, conducted in New Delhi, India in the English language.
          </p>
        </section>

      </div>
    </LegalLayout>
  );
}
