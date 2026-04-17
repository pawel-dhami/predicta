/* ── Student Data ───────────────────────────────────────────────── */
const NAMES = ['Arjun Shah','Priya Nair','Rohan Das','Neha Jain','Sahil Mehta','Tanvi Roy','Kunal Singh','Isha Patel','Aman Verma','Diya Sen'];
const BRANCHES = ['CSE','IT','ECE','CSE','EEE','ME','CSE','IT','ECE','CSE'];
const STAGES_ORDER = ['Skills','Applications','Interviews','Offers'];

export const mockStudents = NAMES.map((name, i) => {
  const riskScore = +(0.15 + i * 0.07).toFixed(2);
  const journeyIndex = i < 3 ? 3 : i < 6 ? 2 : i < 8 ? 1 : 0;
  return {
    id: i + 1,
    name,
    branch: BRANCHES[i],
    year: 4,
    skills: {
      DSA: 8 - (i % 3),
      SQL: 6 + (i % 4),
      Communication: 8 - (i % 2),
      SystemDesign: 3 + (i % 5),
      Projects: 7,
      Aptitude: 6 + (i % 3),
    },
    targetCompanies: ['TCS','Infosys','Goldman Sachs'],
    applications: [
      { company: 'TCS', role: 'Software Engineer', stage: i < 3 ? 'OFFER' : i < 5 ? 'INTERVIEW' : 'APPLIED', date: '2026-04-07', deadline: '2026-04-15' },
      { company: 'Infosys', role: 'Systems Engineer', stage: i < 2 ? 'INTERVIEW' : 'OA', date: '2026-04-05', deadline: '2026-04-12' },
      { company: 'Goldman Sachs', role: 'Analyst Engineer', stage: i < 1 ? 'INTERVIEW' : 'APPLIED', date: '2026-04-03', deadline: '2026-04-10' },
    ],
    roadmapTasks: [
      { id: 'r1', title: 'Solve 20 SQL join problems', done: i < 4, due: 'Apr 13', priority: 'HIGH', createdBy: 'AI' },
      { id: 'r2', title: 'Mock interview with peer', done: i < 6, due: 'Apr 11', priority: 'NORMAL', createdBy: 'Manual' },
      { id: 'r3', title: 'System Design fundamentals course', done: i < 2, due: 'Apr 16', priority: 'HIGH', createdBy: 'AI' },
      { id: 'r4', title: 'Complete aptitude test series', done: i < 3, due: 'Apr 14', priority: 'NORMAL', createdBy: 'AI' },
      { id: 'r5', title: 'Update resume with latest project', done: i < 7, due: 'Apr 10', priority: 'LOW', createdBy: 'Manual' },
    ],
    riskScore,
    placementStatus: i < 3 ? 'Placed' : 'Pending',
    lastActive: `${i + 1}h ago`,
    agentMemory: ['Generated personalized roadmap', 'Sent deadline reminder for GS', 'Flagged System Design skill gap'],
    journeyStage: STAGES_ORDER[journeyIndex],
    journeyStages: STAGES_ORDER.map((s, si) => ({
      name: s,
      status: si < journeyIndex ? 'completed' : si === journeyIndex ? 'current' : 'pending',
    })),
  };
});

/* ── Company Recommendation Engine Seed ────────────────────────── */
export const recommendationSeed = [
  {
    id: 1, priority: 'URGENT', initials: 'GS', company: 'Goldman Sachs',
    role: 'Analyst Engineer', match: 87,
    gaps: ['SQL','System Design'],
    reasoning: 'Strong coding profile with 87% overall match. Two core skill gaps identified that can be closed in 5 days.',
    jd: 'Build scalable internal tools, optimize workflows, and collaborate across quantitative and engineering teams. Requires strong SQL, system design, and analytical skills.',
    selectionProbability: 72,
  },
  {
    id: 2, priority: 'HIGH', initials: 'IN', company: 'Infosys',
    role: 'Specialist Programmer', match: 81,
    gaps: ['Aptitude'],
    reasoning: 'Excellent communication and project portfolio. Aptitude score slightly below cut-off; a 3-day sprint should fix it.',
    jd: 'Work on client solutions and delivery pipelines across global teams. Strong aptitude, communication, and teamwork expected.',
    selectionProbability: 65,
  },
  {
    id: 3, priority: 'NORMAL', initials: 'TC', company: 'TCS',
    role: 'Digital Engineer', match: 75,
    gaps: ['DSA'],
    reasoning: 'Reliable fit with one technical gap in algorithm speed. Apply early as roles fill fast.',
    jd: 'Build enterprise-grade software in agile teams. Competitive coding and DSA skills valued for problem-solving rounds.',
    selectionProbability: 58,
  },
];

/* ── Smart Alerts & Deadlines ──────────────────────────────────── */
export const alertsSeed = [
  { id: 1, type: 'urgent', text: 'Goldman Sachs application deadline in 2 days', time: '2 hours ago', deadline: '2026-04-11', actionText: 'Complete application now' },
  { id: 2, type: 'warning', text: 'OA score dipped below threshold in aptitude', time: '5 hours ago', deadline: null, actionText: 'Start aptitude sprint' },
  { id: 3, type: 'info', text: 'New Infosys role matched to your profile', time: '1 day ago', deadline: '2026-04-20', actionText: 'View job description' },
  { id: 4, type: 'urgent', text: 'Mock interview scheduled for tomorrow 10 AM', time: '3 hours ago', deadline: '2026-04-10', actionText: 'Prepare now' },
  { id: 5, type: 'warning', text: 'System Design skill below company threshold', time: '1 day ago', deadline: null, actionText: 'Start learning path' },
];

/* ── Skill vs Company Requirements Mapping ─────────────────────── */
export const companyRequirements = [
  { company: 'Goldman Sachs', role: 'Analyst Engineer', logo: 'GS', requirements: { DSA: 8, SQL: 9, Communication: 7, SystemDesign: 7, Projects: 8, Aptitude: 8 } },
  { company: 'Infosys', role: 'Specialist Programmer', logo: 'IN', requirements: { DSA: 7, SQL: 7, Communication: 7, SystemDesign: 6, Projects: 7, Aptitude: 7 } },
  { company: 'TCS', role: 'Digital Engineer', logo: 'TC', requirements: { DSA: 6, SQL: 6, Communication: 7, SystemDesign: 5, Projects: 6, Aptitude: 7 } },
  { company: 'Microsoft', role: 'SDE Intern', logo: 'MS', requirements: { DSA: 9, SQL: 7, Communication: 6, SystemDesign: 8, Projects: 8, Aptitude: 7 } },
  { company: 'Amazon', role: 'SDE I', logo: 'AZ', requirements: { DSA: 9, SQL: 8, Communication: 7, SystemDesign: 8, Projects: 7, Aptitude: 8 } },
];

/* ── Batch Real-time Metrics (TPC Admin) ──────────────────────── */
export const batchRealtimeMetrics = {
  totalStudents: 284,
  registered: 284,
  skillReady: 210,
  applied: 156,
  interview: 73,
  offer: 97,
  placed: 97,
  atRisk: 43,
  avgScore: 71,
  activeApplications: 156,
  companiesVisiting: 18,
  placementRate: 34.2,
  avgPackage: '8.4 LPA',
  highestPackage: '24 LPA',
};

/* ── Application Tracking Stages ──────────────────────────────── */
export const APPLICATION_STAGES = ['APPLIED', 'OA', 'INTERVIEW', 'OFFER', 'REJECTED'];
export const APPLICATION_STAGE_COLORS = {
  APPLIED: '#ffd166',
  OA: '#00cfff',
  INTERVIEW: '#a78bfa',
  OFFER: '#00ff9d',
  REJECTED: '#ff6b6b',
};
