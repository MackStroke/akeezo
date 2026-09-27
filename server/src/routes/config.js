import { Router } from 'express';
import { SiteConfig } from '../models/SiteConfig.js';

const router = Router();

router.get('/', async (req, res, next) => {
  // Prevent browser caching so maintenance toggles reflect immediately
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const config = await SiteConfig.findOne({ key: 'global_settings' }).lean();
    res.json({ 
      ok: true, 
      data: { 
        maintenancePages: config?.maintenancePages || [],
        cities: config?.cities || [],
        countries: config?.countries || [],
        gtmId: config?.gtmId || '',
        googleSiteVerification: config?.googleSiteVerification || '',
        homeServices: config?.homeServices || [],
        emergencyPlaceTypes: config?.emergencyPlaceTypes || [],
        emergencyProblems: config?.emergencyProblems || [],
        planTreatments: config?.planTreatments?.length > 0 ? config.planTreatments : [
          { id: 'cardiac', label: 'Cardiac care', icon: 'heart' },
          { id: 'oncology', label: 'Cancer treatment', icon: 'ribbon' },
          { id: 'orthopaedics', label: 'Orthopaedics', icon: 'bone' },
          { id: 'neurology', label: 'Neurology & neurosurgery', icon: 'brain' },
          { id: 'transplant', label: 'Organ transplant', icon: 'organ' },
          { id: 'fertility', label: 'Fertility & IVF', icon: 'spark' },
          { id: 'second-opinion', label: 'Second opinion', icon: 'clipboard' },
          { id: 'dental', label: 'Dental', icon: 'tooth' },
          { id: 'cosmetic', label: 'Cosmetic & plastic surgery', icon: 'spark' },
          { id: 'diagnosis', label: 'Diagnosis & health checks', icon: 'stethoscope' }
        ],
        planTimelines: config?.planTimelines?.length > 0 ? config.planTimelines : ['Within 24-48 hours', 'Within a week', 'Within a month', 'Planning for later', 'Not sure yet'],
        homeDurations: config?.homeDurations?.length > 0 ? config.homeDurations : ['A single visit', 'A few days', '1-2 weeks', 'A month or more', 'Ongoing / long term', 'Not sure'],
        medicinesNeedTypes: config?.medicinesNeedTypes?.length > 0 ? config.medicinesNeedTypes : ['Medicine', 'Supplements'],
        medicinesContent: config?.medicinesContent || { heroTitle: 'Medicines & Supplements', heroSubtitle: 'Upload your prescription or let us know what you need. Our executive will reach out to you to confirm your order and arrange delivery.', banners: [], offers: [] },
        homeContent: (!config?.homeContent || !config.homeContent.whyUsCards || config.homeContent.whyUsCards.length === 0) ? { 
          whyUsTitle: config?.homeContent?.whyUsTitle || 'Why Us', 
          whyUsDescription: config?.homeContent?.whyUsDescription || 'Akeezo is your trusted home care partner which helps you experience the best medical care in the comfort of your home. We understand you and ensure the highest standard of personalized healthcare at your doorstep.', 
          whyUsCards: [
            {
              id: '1',
              text: 'Access to a distinguished panel of doctors affiliated with leading hospitals, available 24/7 at cost-effective rates.',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>'
            },
            {
              id: '2',
              text: 'One-stop platform for all your healthcare needs, including doctors, diagnostic tests, and trained nurses.',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#AD1457" d="M36,4c0,9.3-6,13.2-12.8,17.8C16.1,26.5,8,31.8,8,44h4c0-10.1,6.5-14.4,13.4-18.9C32.2,20.6,40,15.4,40,4 H36z"></path><path fill="#AD1457" d="M38,41H11c-0.6,0-1-0.4-1-1s0.4-1,1-1h27c0.6,0,1,0.4,1,1S38.6,41,38,41z"></path><path fill="#AD1457" d="M36,37H12c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S36.6,37,36,37z"></path><path fill="#AD1457" d="M34,33H14c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S34.6,33,34,33z"></path><path fill="#AD1457" d="M29,29H19c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S29.6,29,29,29z"></path><path fill="#E91E63" d="M37,9H10C9.4,9,9,8.6,9,8s0.4-1,1-1h27c0.6,0,1,0.4,1,1S37.6,9,37,9z"></path><path fill="#E91E63" d="M36,13H12c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S36.6,13,36,13z"></path><path fill="#E91E63" d="M34,17H14c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S34.6,17,34,17z"></path><path fill="#E91E63" d="M29,21H19c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S29.6,21,29,21z"></path><path fill="#E91E63" d="M40,44h-4c0-10.1-6.5-14.4-13.4-18.9C15.8,20.6,8,15.4,8,4h4c0,9.3,6,13.2,12.8,17.8 C31.9,26.5,40,31.8,40,44z"></path></svg>'
            },
            {
              id: '3',
              text: 'Run & managed by a team of doctors with 10+ years of experience in medical field',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle fill="#FFA726" cx="12" cy="21" r="5"></circle><g fill="#455A64"><path d="M2,34.7c0,0,2.8-6.3,10-6.3s10,6.3,10,6.3V38H2V34.7z"></path><path d="M46,34.7c0,0-2.8-6.3-10-6.3s-10,6.3-10,6.3V38h20V34.7z"></path></g><circle fill="#FFB74D" cx="24" cy="17" r="6"></circle><path fill="#607D8B" d="M36,34.1c0,0-3.3-7.5-12-7.5s-12,7.5-12,7.5V38h24V34.1z"></path><circle fill="#FFA726" cx="36" cy="21" r="5"></circle><circle fill="#FFA726" cx="12" cy="21" r="5"></circle><circle fill="#FFA726" cx="36" cy="21" r="5"></circle></svg>'
            },
            {
              id: '4',
              text: 'Complimentary consultations & services post doctor visits and test bookings',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#FFA726"><circle cx="10" cy="26" r="4"></circle><circle cx="38" cy="26" r="4"></circle></g><path fill="#FFB74D" d="M39,19c0-12.7-30-8.3-30,0c0,1.8,0,8.2,0,10c0,8.3,6.7,15,15,15s15-6.7,15-15C39,27.2,39,20.8,39,19z"></path><path fill="#FF5722" d="M24,3C14.6,3,7,10.6,7,20c0,1.2,0,3.4,0,3.4L9,25v-3l21-9.8l9,9.8v3l2-1.6c0,0,0-2.1,0-3.4 C41,12,35.3,3,24,3z"></path><g fill="#784719"><circle cx="31" cy="26" r="2"></circle><circle cx="17" cy="26" r="2"></circle></g><path fill="#757575" d="M43,24c-0.6,0-1,0.4-1,1v-7c0-8.8-7.2-16-16-16h-7c-0.6,0-1,0.4-1,1s0.4,1,1,1h7c7.7,0,14,6.3,14,14v10 c0,0.6,0.4,1,1,1s1-0.4,1-1v2c0,3.9-3.1,7-7,7H24c-0.6,0-1,0.4-1,1s0.4,1,1,1h11c5,0,9-4,9-9v-5C44,24.4,43.6,24,43,24z"></path><g fill="#37474F"><path d="M43,22h-1c-1.1,0-2,0.9-2,2v4c0,1.1,0.9,2,2,2h1c1.1,0,2-0.9,2-2v-4C45,22.9,44.1,22,43,22z"></path><circle cx="24" cy="38" r="2"></circle></g></svg>'
            },
            {
              id: '5',
              text: 'One app for one family- Just add your family members in the app & book tests for them from anywhere',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#D1C4E9"><path d="M38,7H10C8.9,7,8,7.9,8,9v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V9C40,7.9,39.1,7,38,7z"></path><path d="M38,19H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-6C40,19.9,39.1,19,38,19z"></path><path d="M38,31H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-6C40,31.9,39.1,31,38,31z"></path></g><circle fill="#43A047" cx="38" cy="38" r="10"></circle><g fill="#fff"><rect x="36" y="32" width="4" height="12"></rect><rect x="32" y="36" width="12" height="4"></rect></g></svg>'
            },
            {
              id: '6',
              text: 'Certified and best quality labs around your home for all your diagnostic needs',
              svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#D1C4E9"><path d="M38,7H10C8.9,7,8,7.9,8,9v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V9C40,7.9,39.1,7,38,7z"></path><path d="M38,19H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h25.1c1.3-1.3,4.9-0.9,4.9-2v-6C40,19.9,39.1,19,38,19z"></path><path d="M34.4,31H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-2.4C40,33.5,37.5,31,34.4,31z"></path></g><path fill="#009688" d="M46,25H32c-1.1,0-2,0.9-2,2v11.8c0,1.3,0.6,2.4,1.6,3.2l7.4,5.5l7.4-5.5c1-0.8,1.6-1.9,1.6-3.2V27 C48,25.9,47.1,25,46,25z"></path></svg>'
            }
          ]
        } : config.homeContent
      } 
    });
  } catch (err) {
    // If DB is offline, fail gracefully returning an empty list
    res.json({ ok: true, data: { maintenancePages: [], cities: [], countries: [], homeServices: [], emergencyPlaceTypes: [], emergencyProblems: [], gtmId: '', googleSiteVerification: '', medicinesContent: { heroTitle: 'Medicines & Supplements', heroSubtitle: 'Upload your prescription or let us know what you need.', banners: [], offers: [] }, homeContent: { whyUsTitle: 'Why Us', whyUsDescription: 'Akeezo is your trusted home care partner which helps you experience the best medical care in the comfort of your home. We understand you and ensure the highest standard of personalized healthcare at your doorstep.', whyUsCards: [
      {
        id: '1',
        text: 'Access to a distinguished panel of doctors affiliated with leading hospitals, available 24/7 at cost-effective rates.',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>'
      },
      {
        id: '2',
        text: 'One-stop platform for all your healthcare needs, including doctors, diagnostic tests, and trained nurses.',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#AD1457" d="M36,4c0,9.3-6,13.2-12.8,17.8C16.1,26.5,8,31.8,8,44h4c0-10.1,6.5-14.4,13.4-18.9C32.2,20.6,40,15.4,40,4 H36z"></path><path fill="#AD1457" d="M38,41H11c-0.6,0-1-0.4-1-1s0.4-1,1-1h27c0.6,0,1,0.4,1,1S38.6,41,38,41z"></path><path fill="#AD1457" d="M36,37H12c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S36.6,37,36,37z"></path><path fill="#AD1457" d="M34,33H14c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S34.6,33,34,33z"></path><path fill="#AD1457" d="M29,29H19c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S29.6,29,29,29z"></path><path fill="#E91E63" d="M37,9H10C9.4,9,9,8.6,9,8s0.4-1,1-1h27c0.6,0,1,0.4,1,1S37.6,9,37,9z"></path><path fill="#E91E63" d="M36,13H12c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S36.6,13,36,13z"></path><path fill="#E91E63" d="M34,17H14c-0.6,0-1-0.4-1-1s0.4-1,1-1h20c0.6,0,1,0.4,1,1S34.6,17,34,17z"></path><path fill="#E91E63" d="M29,21H19c-0.6,0-1-0.4-1-1s0.4-1,1-1h10c0.6,0,1,0.4,1,1S29.6,21,29,21z"></path><path fill="#E91E63" d="M40,44h-4c0-10.1-6.5-14.4-13.4-18.9C15.8,20.6,8,15.4,8,4h4c0,9.3,6,13.2,12.8,17.8 C31.9,26.5,40,31.8,40,44z"></path></svg>'
      },
      {
        id: '3',
        text: 'Run & managed by a team of doctors with 10+ years of experience in medical field',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle fill="#FFA726" cx="12" cy="21" r="5"></circle><g fill="#455A64"><path d="M2,34.7c0,0,2.8-6.3,10-6.3s10,6.3,10,6.3V38H2V34.7z"></path><path d="M46,34.7c0,0-2.8-6.3-10-6.3s-10,6.3-10,6.3V38h20V34.7z"></path></g><circle fill="#FFB74D" cx="24" cy="17" r="6"></circle><path fill="#607D8B" d="M36,34.1c0,0-3.3-7.5-12-7.5s-12,7.5-12,7.5V38h24V34.1z"></path><circle fill="#FFA726" cx="36" cy="21" r="5"></circle><circle fill="#FFA726" cx="12" cy="21" r="5"></circle><circle fill="#FFA726" cx="36" cy="21" r="5"></circle></svg>'
      },
      {
        id: '4',
        text: 'Complimentary consultations & services post doctor visits and test bookings',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#FFA726"><circle cx="10" cy="26" r="4"></circle><circle cx="38" cy="26" r="4"></circle></g><path fill="#FFB74D" d="M39,19c0-12.7-30-8.3-30,0c0,1.8,0,8.2,0,10c0,8.3,6.7,15,15,15s15-6.7,15-15C39,27.2,39,20.8,39,19z"></path><path fill="#FF5722" d="M24,3C14.6,3,7,10.6,7,20c0,1.2,0,3.4,0,3.4L9,25v-3l21-9.8l9,9.8v3l2-1.6c0,0,0-2.1,0-3.4 C41,12,35.3,3,24,3z"></path><g fill="#784719"><circle cx="31" cy="26" r="2"></circle><circle cx="17" cy="26" r="2"></circle></g><path fill="#757575" d="M43,24c-0.6,0-1,0.4-1,1v-7c0-8.8-7.2-16-16-16h-7c-0.6,0-1,0.4-1,1s0.4,1,1,1h7c7.7,0,14,6.3,14,14v10 c0,0.6,0.4,1,1,1s1-0.4,1-1v2c0,3.9-3.1,7-7,7H24c-0.6,0-1,0.4-1,1s0.4,1,1,1h11c5,0,9-4,9-9v-5C44,24.4,43.6,24,43,24z"></path><g fill="#37474F"><path d="M43,22h-1c-1.1,0-2,0.9-2,2v4c0,1.1,0.9,2,2,2h1c1.1,0,2-0.9,2-2v-4C45,22.9,44.1,22,43,22z"></path><circle cx="24" cy="38" r="2"></circle></g></svg>'
      },
      {
        id: '5',
        text: 'One app for one family- Just add your family members in the app & book tests for them from anywhere',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#D1C4E9"><path d="M38,7H10C8.9,7,8,7.9,8,9v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V9C40,7.9,39.1,7,38,7z"></path><path d="M38,19H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-6C40,19.9,39.1,19,38,19z"></path><path d="M38,31H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-6C40,31.9,39.1,31,38,31z"></path></g><circle fill="#43A047" cx="38" cy="38" r="10"></circle><g fill="#fff"><rect x="36" y="32" width="4" height="12"></rect><rect x="32" y="36" width="12" height="4"></rect></g></svg>'
      },
      {
        id: '6',
        text: 'Certified and best quality labs around your home for all your diagnostic needs',
        svgContent: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#D1C4E9"><path d="M38,7H10C8.9,7,8,7.9,8,9v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2V9C40,7.9,39.1,7,38,7z"></path><path d="M38,19H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h25.1c1.3-1.3,4.9-0.9,4.9-2v-6C40,19.9,39.1,19,38,19z"></path><path d="M34.4,31H10c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h28c1.1,0,2-0.9,2-2v-2.4C40,33.5,37.5,31,34.4,31z"></path></g><path fill="#009688" d="M46,25H32c-1.1,0-2,0.9-2,2v11.8c0,1.3,0.6,2.4,1.6,3.2l7.4,5.5l7.4-5.5c1-0.8,1.6-1.9,1.6-3.2V27 C48,25.9,47.1,25,46,25z"></path></svg>'
      }
    ]} } });
  }
});

export default router;
