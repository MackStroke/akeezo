import { LegalLayout } from '@/components/legal/LegalLayout';
import { AlertTriangle, Stethoscope, ShieldAlert, HeartPulse, FileCheck2 } from 'lucide-react';
import SEO from '@/components/SEO';

const TOC = [
  { id: 'sec-1', title: '1. Facilitation Role & Non-Clinical Platform' },
  { id: 'sec-2', title: '2. Absence of Doctor-Patient Relationship' },
  { id: 'sec-3', title: '3. Clinical Independence & Hospital Authority' },
  { id: 'sec-4', title: '4. Accuracy & Integrity of Diagnostic Scans' },
  { id: 'sec-5', title: '5. Acute Emergency Protocol Notice' },
  { id: 'sec-6', title: '6. Second Opinions & Surgical Verification' },
  { id: 'sec-7', title: '7. Medical Cost Estimate Disclaimer' },
];

export default function MedicalDisclaimerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Medical Disclaimer | AKEEZO',
    url: 'https://www.akeezo.com/disclaimer',
    description: 'AKEEZO Medical Disclaimer. Important information regarding our role as a healthcare facilitation platform.'
  };

  return (
    <>
      <SEO 
        title="Medical Disclaimer"
        description="AKEEZO Medical Disclaimer. Important information regarding our role as a healthcare facilitation platform."
        canonical="/disclaimer"
        jsonLd={jsonLd}
        keywords="AKEEZO Medical Disclaimer, Healthcare Facilitation, Non-Clinical Platform, Medical Disclaimer"
      />
    <LegalLayout
      title="Medical Disclaimer & Clinical Notice"
      subtitle="Important disclosure regarding the non-clinical status of AKEEZO, physician independence, and medical evaluation guidelines."
      category="Medical Disclaimer"
      lastUpdated="September 13, 2026"
      toc={TOC}
    >
      <div className="space-y-8 text-foreground">
        
        {/* Important Alert Callout */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 space-y-2">
          <div className="flex items-center gap-2 font-black text-destructive text-sm uppercase tracking-wider">
            <AlertTriangle className="size-4" /> Critical Health Notice
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
            AKEEZO does not practice medicine, render medical diagnoses, or perform surgical treatments. Information presented on this site or communicated by care coordinators is for informational and logistical facilitation purposes only and must never replace direct professional medical advice.
          </p>
        </div>

        {/* Section 1 */}
        <section id="sec-1" className="space-y-3 pt-2">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <Stethoscope className="size-5 text-primary shrink-0" />
            1. Facilitation Role & Non-Clinical Platform
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AKEEZO Healthcare Platform ("AKEEZO") operates exclusively as a medical travel coordinator, care logistics facilitator, and patient navigation portal. AKEEZO is not a registered medical practice, hospital, clinic, or diagnostic laboratory. All care coordinators, case managers, and platform personnel act strictly in administrative and logistical support capacities.
          </p>
        </section>

        {/* Section 2 */}
        <section id="sec-2" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            2. Absence of Doctor-Patient Relationship
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Submitting a medical inquiry, uploading diagnostic DICOM scans, receiving a hospital cost breakdown, or speaking with an AKEEZO care lead does NOT create a doctor-patient relationship. A legal and clinical doctor-patient relationship is established solely when a patient undergoes formal admission or in-person consultation with a licensed physician at an accredited partner hospital.
          </p>
        </section>

        {/* Section 3 */}
        <section id="sec-3" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            3. Clinical Independence & Hospital Authority
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All medical evaluation opinions, treatment plans, surgical procedures, drug prescriptions, and discharge summaries are rendered independently by host hospital medical boards and licensed treating physicians:
          </p>
          <ul className="list-disc pl-5 text-xs sm:text-sm text-muted-foreground space-y-2">
            <li>Treating physicians exercise absolute clinical independence in evaluating patient suitability for surgical procedures.</li>
            <li>Hospitals reserve the right to alter treatment protocols or request additional diagnostic tests upon physical arrival and evaluation.</li>
            <li>AKEEZO exercises zero control over clinical outcomes, surgical decisions, or hospital medical management.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section id="sec-4" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            4. Accuracy & Integrity of Diagnostic Scans
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Preliminary medical opinions provided prior to travel depend entirely upon the accuracy, clarity, and completeness of medical files uploaded by the patient. AKEEZO assumes no responsibility for misevaluations resulting from corrupted DICOM films, incomplete pathology reports, or omitted medical history.
          </p>
        </section>

        {/* Section 5 */}
        <section id="sec-5" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <ShieldAlert className="size-5 text-emergency shrink-0" />
            5. Acute Emergency Protocol Notice
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Do NOT use web forms or digital portals for acute, life-threatening emergencies requiring immediate CPR, advanced cardiac life support, or stroke management. If you or a family member are experiencing a life-threatening acute emergency, dial your local municipal emergency telephone number (e.g., 112, 911, 102) immediately.
          </p>
        </section>

        {/* Section 6 */}
        <section id="sec-6" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2">
            6. Second Opinions & Surgical Verification
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AKEEZO strongly encourages all patients considering elective surgery, organ transplant, or complex oncology therapy to seek second opinions from qualified local specialists in their home country in addition to host hospital evaluations.
          </p>
        </section>

        {/* Section 7 */}
        <section id="sec-7" className="space-y-3 pt-4">
          <h2 className="text-xl font-black text-ink-strong border-b border-border pb-2 flex items-center gap-2">
            <FileCheck2 className="size-5 text-primary shrink-0" />
            7. Medical Cost Estimate Disclaimer
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cost breakdowns displayed on AKEEZO are indicative pre-assessment estimates based on standard clinical pathways. Actual final hospital billing may vary based on pre-existing comorbidities, required ICU stay extensions, specialized implants, or unforeseen surgical complications encountered during treatment.
          </p>
        </section>

      </div>
    </LegalLayout>
    </>
  );
}
