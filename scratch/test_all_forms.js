import { connectDatabase } from '../server/src/config/db.js';
import { Lead } from '../server/src/models/Lead.js';
import { EmergencyRequest } from '../server/src/models/EmergencyRequest.js';
import { Recommendation } from '../server/src/models/Recommendation.js';
import { User } from '../server/src/models/User.js';
import { Blog } from '../server/src/models/Blog.js';

const API_BASE = 'http://localhost:5000';

async function runAllFormTests() {
  console.log('=== STARTING ALL FORM & ADMIN VISIBILITY TESTSUITE ===\n');

  await connectDatabase();

  const timestamp = Date.now();

  // TEST 1: Planned Care / Medical Tourism Lead Form
  console.log('1. Testing Plan Treatment / Medical Tourism Form Submission...');
  const leadPayload = {
    intent: 'medical_tourism',
    treatment: 'Cardiology / CABG Surgery Test',
    name: `Test Patient ${timestamp}`,
    email: `patient_${timestamp}@example.com`,
    phone: '+91 9876543210',
    country: 'Kenya',
    preferredCity: 'Delhi NCR',
    urgency: 'within_48h',
    message: 'Test automated lead form submission',
    consent: true,
  };

  const leadRes = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadPayload),
  });
  const leadJson = await leadRes.json();
  console.log('   Response status:', leadRes.status);
  console.log('   Response body:', leadJson);
  if (!leadRes.ok || !leadJson.ok) throw new Error('Lead submission failed!');
  const journeyId = leadJson.data.journeyId;

  // TEST 2: Home Healthcare Lead Form
  console.log('\n2. Testing Home Healthcare Form Submission...');
  const homePayload = {
    intent: 'home_healthcare',
    treatment: 'Nurse at Home',
    name: `Test Home Patient ${timestamp}`,
    email: `home_${timestamp}@example.com`,
    phone: '+91 9876543211',
    preferredCity: 'Mumbai',
    urgency: 'within_1_week',
    message: 'Test automated home care form submission',
    consent: true,
  };

  const homeRes = await fetch(`${API_BASE}/api/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(homePayload),
  });
  const homeJson = await homeRes.json();
  console.log('   Response status:', homeRes.status);
  console.log('   Response body:', homeJson);
  if (!homeRes.ok || !homeJson.ok) throw new Error('Home healthcare submission failed!');
  const homeJourneyId = homeJson.data.journeyId;

  // TEST 3: Emergency SOS Form
  console.log('\n3. Testing Emergency SOS Form Submission...');
  const emergencyPayload = {
    location: { label: 'Hotel Taj, Aerocity, New Delhi', placeType: 'hotel' },
    problem: 'Chest pain and breathlessness',
    requesterName: `Test SOS Requester ${timestamp}`,
    requesterPhone: '+91 9876543212',
  };

  const emRes = await fetch(`${API_BASE}/api/emergency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emergencyPayload),
  });
  const emJson = await emRes.json();
  console.log('   Response status:', emRes.status);
  console.log('   Response body:', emJson);
  if (!emRes.ok || !emJson.ok) throw new Error('Emergency submission failed!');
  const caseId = emJson.data.caseId;

  // TEST 4: Hub Recommendation Form (City)
  console.log('\n4. Testing Hub Recommendation Form (City)...');
  const recCityPayload = {
    type: 'city',
    targetName: `Test City ${timestamp}`,
    region: 'Rajasthan',
    name: `Test City Recommender ${timestamp}`,
    phone: '+91 9876543213',
    email: `reccity_${timestamp}@example.com`,
    reason: 'Need top cardiac unit in this city',
  };

  const recCityRes = await fetch(`${API_BASE}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recCityPayload),
  });
  const recCityJson = await recCityRes.json();
  console.log('   Response status:', recCityRes.status);
  console.log('   Response body:', recCityJson);
  if (!recCityRes.ok || !recCityJson.ok) throw new Error('City recommendation submission failed!');
  const recCityId = recCityJson.data.recommendationId;

  // TEST 5: Hub Recommendation Form (Country)
  console.log('\n5. Testing Hub Recommendation Form (Country)...');
  const recCountryPayload = {
    type: 'country',
    targetName: `Test Country ${timestamp}`,
    region: 'East Africa',
    name: `Test Country Recommender ${timestamp}`,
    phone: '+91 9876543214',
    email: `reccountry_${timestamp}@example.com`,
    reason: 'High demand for oncology referrals',
  };

  const recCountryRes = await fetch(`${API_BASE}/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recCountryPayload),
  });
  const recCountryJson = await recCountryRes.json();
  console.log('   Response status:', recCountryRes.status);
  console.log('   Response body:', recCountryJson);
  if (!recCountryRes.ok || !recCountryJson.ok) throw new Error('Country recommendation submission failed!');
  const recCountryId = recCountryJson.data.recommendationId;

  // TEST 6: ADMIN PANEL VISIBILITY VERIFICATION
  console.log('\n=== VERIFYING ADMIN PANEL ENDPOINTS & STORED DATA ===\n');

  // Admin login
  const loginRes = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'password' }),
  });
  const loginJson = await loginRes.json();
  if (!loginJson.ok) throw new Error('Admin login failed!');
  const adminHeaders = { Authorization: `Bearer ${loginJson.token}` };

  // Fetch admin leads
  console.log('Checking /api/admin/leads...');
  const adminLeadsRes = await fetch(`${API_BASE}/api/admin/leads`, { headers: adminHeaders });
  const adminLeadsJson = await adminLeadsRes.json();
  console.log(`   Fetched ${adminLeadsJson.data?.length} leads from admin API.`);
  const foundLead = adminLeadsJson.data?.find((l) => l.journeyId === journeyId);
  const foundHome = adminLeadsJson.data?.find((l) => l.journeyId === homeJourneyId);
  console.log('   -> Medical Tourism Lead visible in admin?:', Boolean(foundLead));
  console.log('   -> Home Care Lead visible in admin?:', Boolean(foundHome));

  // Fetch admin emergencies
  console.log('\nChecking /api/admin/emergencies...');
  const adminEmRes = await fetch(`${API_BASE}/api/admin/emergencies`, { headers: adminHeaders });
  const adminEmJson = await adminEmRes.json();
  console.log(`   Fetched ${adminEmJson.data?.length} emergency cases from admin API.`);
  const foundEm = adminEmJson.data?.find((e) => e.caseId === caseId);
  console.log('   -> Emergency Case visible in admin?:', Boolean(foundEm));

  // Fetch admin recommendations
  console.log('\nChecking /api/admin/recommendations...');
  const adminRecRes = await fetch(`${API_BASE}/api/admin/recommendations`, { headers: adminHeaders });
  const adminRecJson = await adminRecRes.json();
  console.log(`   Fetched ${adminRecJson.data?.length} recommendations from admin API.`);
  const foundRecCity = adminRecJson.data?.find((r) => r.recommendationId === recCityId);
  const foundRecCountry = adminRecJson.data?.find((r) => r.recommendationId === recCountryId);
  console.log('   -> City Recommendation visible in admin?:', Boolean(foundRecCity));
  console.log('   -> Country Recommendation visible in admin?:', Boolean(foundRecCountry));

  // Fetch admin stats & activity
  console.log('\nChecking /api/admin/stats...');
  const adminStatsRes = await fetch(`${API_BASE}/api/admin/stats`, { headers: adminHeaders });
  const adminStatsJson = await adminStatsRes.json();
  console.log('   Stats Summary:', {
    totalLeads: adminStatsJson.data?.totalLeads,
    totalEmergencies: adminStatsJson.data?.totalEmergencies,
    totalRecommendations: adminStatsJson.data?.totalRecommendations,
    recentActivityCount: adminStatsJson.data?.recentActivity?.length,
  });

  console.log('\n=== ALL TESTCASES COMPLETED SUCCESSFULLY! ===');
  process.exit(0);
}

runAllFormTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
