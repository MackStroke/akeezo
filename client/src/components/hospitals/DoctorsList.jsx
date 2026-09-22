import { UserRound, Stethoscope, Languages, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function DoctorsList({ doctors = [] }) {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-lg text-muted-foreground">
        Medical team details are being updated for this hospital.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.map((doc, idx) => (
        <Card key={idx} className="bg-card">
          <CardContent className="p-5 flex items-start gap-4">
            
            {doc.image ? (
              <img 
                src={doc.image} 
                alt={doc.name} 
                className="shrink-0 w-16 h-16 object-cover rounded-full border shadow-sm mt-1" 
              />
            ) : (
              <div className="shrink-0 w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mt-1 border shadow-sm">
                <UserRound className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-ink-strong truncate" title={doc.name}>
                {doc.name}
              </h4>
              
              <div className="text-sm text-primary font-medium truncate mb-2">
                {doc.designation || 'Specialist'}
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate capitalize">{doc.specialty}</span>
                </div>
                
                {doc.experienceYears > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{doc.experienceYears}+ Years Experience</span>
                  </div>
                )}
                
                {doc.languages && doc.languages.length > 0 && (
                  <div className="flex items-start gap-1.5">
                    <Languages className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">
                      {doc.languages.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}
