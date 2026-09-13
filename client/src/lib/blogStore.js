/**
 * Single source of truth for AKEEZO Blog articles with localStorage persistence.
 * Admin updates reflect live on public blog routes (/blog and /blog/:slug).
 */

const BLOG_STORAGE_KEY = 'akeezo_blog_posts';

export const DEFAULT_BLOG_POSTS = [
  {
    id: 'post_1',
    title: 'Ultimate Guide to Medical Travel in India: Hospitals, Visa & Cost Breakdown',
    slug: 'ultimate-guide-medical-travel-india',
    category: 'Medical Tourism',
    excerpt: 'Everything international patients need to know about planning medical treatment in India — JCI accreditation, doctor evaluations, medical visas, and cost estimates.',
    content: `
Medical tourism in India has grown rapidly over the last decade, offering international patients access to world-class clinical care at a fraction of Western costs.

### Why Choose India for Medical Treatment?
India is home to over 40 JCI (Joint Commission International) accredited hospitals and thousands of NABH-certified specialty care centers. Leading tertiary hospitals in Delhi NCR, Mumbai, Bengaluru, and Chennai feature cutting-edge technology including robotic surgery suites, proton beam therapy, and advanced cardiac catheterization labs.

### Key Journey Stages for International Patients
1. **Initial Case Review**: Submit diagnostic scans and medical history for multi-specialty physician opinion.
2. **Itemized Estimate**: Receive transparent cost breakdowns covering hospital stay, surgeon fees, ICU charges, and post-op rehabilitation.
3. **Medical Visa Assistance**: Obtain official hospital invitation letters required for Embassy Medical Visas.
4. **Airport Concierge & Travel**: Dedicated care coordinators meet patients at airport arrivals with language interpreters and wheelchair-accessible transport.
5. **Hospital Admission & Recovery**: Seamless admission procedure with 24/7 dedicated patient leads.

### Estimated Cost Comparison
| Treatment Specialty | USA / UK Average | India Accredited Hospital |
| :--- | :--- | :--- |
| Coronary Artery Bypass (CABG) | $75,000 - $120,000 | $5,500 - $8,500 |
| Total Knee Replacement | $45,000 - $65,000 | $4,200 - $6,500 |
| Bone Marrow Transplant | $250,000+ | $22,000 - $35,000 |
| IVF Fertility Cycle | $15,000 - $22,000 | $2,800 - $4,200 |

### Essential Travel Checklist
- Valid Passport with at least 6 months validity.
- Official Medical Visa (or Medical Attendant Visa for family companions).
- All physical DICOM CD scans, MRI films, and diagnostic lab reports.
- Contact info for your AKEEZO assigned international care lead.
    `,
    coverImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80',
    author: 'Dr. Ananya Sharma',
    authorRole: 'Head of International Patient Services',
    authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    date: 'Sep 10, 2026',
    readTime: '6 min read',
    views: 1420,
    status: 'Published', // 'Published' | 'Draft'
    featured: true,
  },
  {
    id: 'post_2',
    title: 'Understanding Emergency Cardiac Care: Signs, Golden Hour & Transport',
    slug: 'emergency-cardiac-care-golden-hour',
    category: 'Emergency Care',
    excerpt: 'Recognizing early symptoms of cardiac distress, understanding the critical golden hour, and coordinating emergency ambulance transport.',
    content: `
In acute cardiovascular events, every minute counts. Understanding the warning signs of a heart attack and acting quickly can dramatically improve survival outcomes and reduce long-term heart tissue damage.

### The Critical "Golden Hour"
The first 60 minutes after the onset of severe cardiac symptoms is known as the "golden hour". Receiving specialized interventional cardiac care — such as emergency primary PCI (angioplasty) — within this window saves cardiac muscle tissue.

### Warning Symptoms Never To Ignore
- **Chest Pressure or Tightness**: A squeezing sensation in the center or left side of the chest lasting more than a few minutes.
- **Radiating Pain**: Discomfort spreading to the shoulder, left arm, neck, jaw, or back.
- **Shortness of Breath**: Difficulty breathing occurring with or without chest pain.
- **Cold Sweats & Lightheadedness**: Sudden unexplained dizziness, nausea, or clammy skin.

### Emergency Action Protocol
1. **Call Emergency Desk Immediately**: Contact AKEEZO Emergency Control Desk (+91 11 4084 5678) or your local emergency dispatch.
2. **Keep Patient Rested**: Have the patient sit down in a comfortable upright position. Avoid physical exertion.
3. **Do Not Drive Yourself**: Always wait for an Advanced Life Support (ALS) cardiac ambulance equipped with defibrillators and oxygen.
    `,
    coverImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1000&auto=format&fit=crop&q=80',
    author: 'Dr. Vikramaditya Rao',
    authorRole: 'Chief Emergency Cardiac Specialist',
    authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    date: 'Sep 08, 2026',
    readTime: '4 min read',
    views: 980,
    status: 'Published',
    featured: false,
  },
  {
    id: 'post_3',
    title: 'Home Healthcare vs. Hospital Stays: Post-Operative Recovery Advantages',
    slug: 'home-healthcare-vs-hospital-stay-recovery',
    category: 'Home Healthcare',
    excerpt: 'How professional home nursing, post-op physiotherapy, and doctor home visits accelerate patient healing while reducing hospital readmission risks.',
    content: `
Recovering from major surgery or managing chronic illness in the comfort of home offers measurable psychological and clinical benefits for patients and families.

### Advantages of Professional Home Care
- **Reduced Infection Exposure**: Home environments significantly lower patient exposure to hospital-acquired resistant pathogens (HAI).
- **Personalized Nursing Care**: Dedicated 1-on-1 nursing care tailored to the patient’s exact wound dressing, IV medication, and vital monitoring needs.
- **Faster Functional Mobility**: Specialized home physiotherapy enables patients to practice walking, stairs, and daily living skills in their actual living spaces.
- **Cost Efficiency**: Transitioning to home nursing after initial hospital stabilization can reduce overall medical recovery costs by 30% to 50%.

### Key Home Healthcare Services
1. **Post-Operative Nursing**: Wound care, drain management, catheter care, and IV antibiotic administration.
2. **Geriatric & Elder Attendants**: 12-hour and 24-hour trained attendants for hygiene, mobility, and medication reminders.
3. **Doctor Home Visits**: Scheduled house calls for post-discharge evaluation, blood sampling, and suture removal.
    `,
    coverImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1000&auto=format&fit=crop&q=80',
    author: 'Sarah Jenkins, RN',
    authorRole: 'Director of Home Nursing & Elder Care',
    authorAvatar: 'https://images.unsplash.com/photo-1594824813571-2153349aed06?w=150&auto=format&fit=crop&q=80',
    date: 'Sep 05, 2026',
    readTime: '5 min read',
    views: 750,
    status: 'Published',
    featured: false,
  },
  {
    id: 'post_4',
    title: 'How to Obtain an Indian Medical Visa Fast: 2026 Step-by-Step Requirements',
    slug: 'indian-medical-visa-step-by-step-guide',
    category: 'Travel & Visa',
    excerpt: 'Official guide on e-Medical visa application rules, hospital invitation letters, medical attendant visas, and airport registration for foreign patients.',
    content: `
Planning international medical travel requires getting your visa documentation right. India offers an efficient e-Medical Visa process for citizens of over 160 countries.

### What is an e-Medical Visa?
An e-Medical Visa (e-MV) is an electronic travel authorization granted to foreign nationals seeking medical treatment in recognized Indian hospitals. It allows triple entry within a 60-day period.

### Required Documentation Checklist
1. **Valid Passport**: Scanned copy of passport bio page with at least 6 months validity from arrival date.
2. **Hospital Invitation Letter**: Official letter on hospital letterhead issued by an accredited Indian medical center stating the patient’s diagnosis and recommended treatment duration.
3. **Passport Photograph**: Recent white background digital photo meeting Indian immigration specifications.
4. **Medical Attendant Visa**: Up to two family members or caregivers can apply for e-Medical Attendant visas alongside the primary patient.

### Step-by-Step Application Steps
- **Step 1**: Register your medical inquiry with AKEEZO to obtain your official hospital invitation letter.
- **Step 2**: Fill out the official Indian e-Visa online application form.
- **Step 3**: Upload diagnostic summary and hospital invitation letter.
- **Step 4**: Receive electronic visa confirmation via email within 48-72 hours.
- **Step 5**: Present printed e-Visa confirmation at immigration control upon arrival at New Delhi, Mumbai, or major international airports.
    `,
    coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&auto=format&fit=crop&q=80',
    author: 'AKEEZO Travel Concierge',
    authorRole: 'International Visa Desk',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    date: 'Aug 28, 2026',
    readTime: '5 min read',
    views: 2110,
    status: 'Published',
    featured: false,
  },
];

export function getStoredBlogPosts() {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error loading blog posts from localStorage:', err);
  }
  // Fallback to default posts
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(DEFAULT_BLOG_POSTS));
  } catch {}
  return DEFAULT_BLOG_POSTS;
}

export function saveBlogPosts(posts) {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Error saving blog posts to localStorage:', err);
  }
}

export function getBlogPostBySlug(slug) {
  const posts = getStoredBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export function addOrUpdateBlogPost(postData) {
  const posts = getStoredBlogPosts();
  const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const existingIndex = posts.findIndex((p) => p.id === postData.id || p.slug === slug);
  let updatedPosts;

  const newPost = {
    id: postData.id || 'post_' + Date.now(),
    title: postData.title,
    slug,
    category: postData.category || 'Medical Tourism',
    excerpt: postData.excerpt || '',
    content: postData.content || '',
    coverImage: postData.coverImage || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80',
    author: postData.author || 'AKEEZO Editorial Team',
    authorRole: postData.authorRole || 'Healthcare Desk',
    authorAvatar: postData.authorAvatar || 'https://ui-avatars.com/api/?name=AKEEZO&background=1D265D&color=fff',
    date: postData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    readTime: postData.readTime || '5 min read',
    views: postData.views || 0,
    status: postData.status || 'Published',
    featured: !!postData.featured,
  };

  if (existingIndex >= 0) {
    updatedPosts = [...posts];
    updatedPosts[existingIndex] = { ...updatedPosts[existingIndex], ...newPost };
  } else {
    updatedPosts = [newPost, ...posts];
  }

  saveBlogPosts(updatedPosts);
  return newPost;
}

export function deleteBlogPost(id) {
  const posts = getStoredBlogPosts();
  const updatedPosts = posts.filter((p) => p.id !== id);
  saveBlogPosts(updatedPosts);
  return updatedPosts;
}

export function toggleBlogPostStatus(id) {
  const posts = getStoredBlogPosts();
  const updatedPosts = posts.map((p) => {
    if (p.id === id) {
      return { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' };
    }
    return p;
  });
  saveBlogPosts(updatedPosts);
  return updatedPosts;
}
