import { HelpCircle, MessagesSquare, FileText, Video } from 'lucide-react';

export default function ConsultancyPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-end">
        <h1 className="text-3xl font-bold tracking-tight text-ink-strong">Consultancy Services</h1>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-ink-strong text-background shadow-md font-semibold text-sm">
          Book Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[1.5rem] shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-rule">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MessagesSquare className="size-6 text-primary" />
          </div>
          <h3 className="font-bold text-ink-strong">Expert Chat</h3>
          <p className="text-sm text-muted-foreground mt-1">Connect with our medical consultants instantly.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-rule">
          <div className="size-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Video className="size-6 text-green-600" />
          </div>
          <h3 className="font-bold text-ink-strong">Video Consult</h3>
          <p className="text-sm text-muted-foreground mt-1">Schedule a telehealth video evaluation.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-rule">
          <div className="size-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <FileText className="size-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-ink-strong">Second Opinion</h3>
          <p className="text-sm text-muted-foreground mt-1">Upload records for independent review.</p>
        </div>

        <div className="bg-white rounded-[1.5rem] shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-rule">
          <div className="size-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
            <HelpCircle className="size-6 text-orange-600" />
          </div>
          <h3 className="font-bold text-ink-strong">FAQs & Guides</h3>
          <p className="text-sm text-muted-foreground mt-1">Self-serve knowledge base.</p>
        </div>
      </div>
    </div>
  );
}
