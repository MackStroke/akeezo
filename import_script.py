import csv
import json
import uuid
from datetime import datetime

def parse_csv(csv_path, json_path):
    hospitals = []
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            hospital_name = row.get('Hospital Name', '').strip()
            if not hospital_name:
                continue
            
            slug = hospital_name.lower().replace(' ', '-').replace(',', '').replace('.', '') + f"-{i}"
            
            # Specialties
            specs_raw = row.get('Primary Specialties / Centers of Excellence', '')
            raw_specs = [s.strip() for s in specs_raw.split(',') if s.strip() and s.strip() != 'Multi-Specialty']
            
            spec_map = {
                'Cardiology': 'cardiac',
                'Cardiac Surgery': 'cardiac',
                'Cardiothoracic Surgery': 'cardiac',
                'Oncology': 'oncology',
                'Orthopedics': 'orthopaedics',
                'Neurology': 'neurology',
                'Organ Transplant': 'transplant',
                'Liver Transplant': 'transplant',
                'Heart Transplant': 'transplant',
                'Bone Marrow Transplant': 'transplant',
                'Fertility': 'fertility',
                'Reproductive Medicine': 'fertility',
                'Gynecology': 'gynecology',
                'Gastroenterology': 'gastroenterology',
            }
            specialties = list(set([spec_map.get(s, s.lower().replace(' ', '_')) for s in raw_specs]))
            
            # City mapping
            raw_city = row.get('City', '').strip()
            city = 'Delhi NCR' if raw_city in ['New Delhi', 'Gurugram', 'Noida'] else raw_city
            
            # Accreditations
            acc_raw = row.get('Accreditations', '')
            accreditations = [a.strip() for a in acc_raw.split(',') if a.strip() and a.strip() != 'None']
            
            # Facilities
            fac_raw = row.get('Key Facilities', '')
            facilities = [f.strip() for f in fac_raw.split(',') if f.strip()]
            
            bed_cap = row.get('Bed Capacity (approx)', '0')
            try:
                bed_capacity = int(bed_cap)
            except:
                bed_capacity = 0
                
            rating = row.get('Rating (out of 5.0)', '4.5')
            try:
                rating_val = float(rating)
            except:
                rating_val = 4.5

            is_active = row.get('Listing Status', 'Active').strip().lower() == 'active'
            
            # Create object
            hospital = {
                "_id": str(uuid.uuid4()),
                "hospitalId": row.get('Hospital ID', '').strip(),
                "name": hospital_name,
                "slug": slug,
                "stateRegion": row.get('State / Region', '').strip(),
                "city": city,
                "locality": row.get('Locality / Area', '').strip(),
                "address": f"{row.get('Locality / Area', '').strip()}, {city}, {row.get('State / Region', '').strip()}",
                "location": {
                    "type": "Point",
                    "coordinates": [77.2 + (i*0.01), 28.5 + (i*0.01)] # dummy coords
                },
                "bedCapacity": bed_capacity,
                "type": row.get('Type', '').strip(),
                "hasEmergency": row.get('Emergency / Trauma Care (24x7)', '').strip().lower() == 'yes',
                "facilities": facilities,
                "rating": rating_val,
                "contact": row.get('Contact / Helpline', '').strip(),
                "website": row.get('Website URL', '').strip(),
                "listingStatus": row.get('Listing Status', 'Active').strip(),
                "specialties": specialties,
                "accreditations": accreditations,
                "centersOfExcellence": specialties[:3],
                "experienceTier": "best_value" if bed_capacity < 500 else "premium",
                "partnerTier": "gold" if rating_val >= 4.5 else "silver",
                "amenities": ["international_patient_desk", "english_speaking"],
                "languages": ["English", "Hindi"],
                "stayLogistics": ["shortest_stay"],
                "nearestAirport": {
                    "name": "International Airport",
                    "code": "INT",
                    "distanceKm": 15
                },
                "doctors": [
                    {
                        "name": "Dr. John Doe",
                        "specialty": specialties[0] if specialties else "General",
                        "designation": "Senior Consultant",
                        "experienceYears": 15,
                        "languages": ["English", "Hindi"]
                    }
                ],
                "treatmentEstimates": [
                    {
                        "treatmentId": s,
                        "treatmentLabel": raw_specs[idx] if idx < len(raw_specs) else s,
                        "procedure": "Standard Procedure",
                        "costRange": {
                            "min": 200000,
                            "max": 400000
                        },
                        "stayDays": {
                            "min": 5,
                            "max": 10
                        }
                    } for idx, s in enumerate(specialties[:2] if specialties else ["General"])
                ],
                "images": [
                    {
                        "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
                        "alt": "Lobby",
                        "category": "lobby"
                    },
                    {
                        "url": "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&h=400&fit=crop",
                        "alt": "Exterior",
                        "category": "exterior"
                    }
                ],
                "description": f"Leading {row.get('Type', '')} institution in {city}, offering comprehensive medical services.",
                "isActive": is_active,
                "isSample": False,
                "createdAt": datetime.utcnow().isoformat() + "Z",
                "updatedAt": datetime.utcnow().isoformat() + "Z"
            }
            hospitals.append(hospital)
            
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(hospitals, f, indent=2)
        
    print(f"Successfully processed {len(hospitals)} hospitals.")

if __name__ == '__main__':
    parse_csv('D:/claude/akeezo/hospitals.csv', 'D:/claude/akeezo/server/.data/hospitals.json')
