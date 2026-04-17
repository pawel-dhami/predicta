// ── Placement Pipeline Trend ──
export const PIPELINE_TREND = [
    { time: '7 am', applications: 12, offers: 2 },
    { time: '8 am', applications: 18, offers: 3 },
    { time: '9 am', applications: 25, offers: 5 },
    { time: '10 am', applications: 32, offers: 4 },
    { time: '11 am', applications: 28, offers: 6 },
    { time: '12 pm', applications: 35, offers: 8 },
    { time: '1 pm', applications: 42, offers: 7 },
    { time: '2 pm', applications: 38, offers: 9 },
    { time: '3 pm', applications: 45, offers: 11 },
    { time: '4 pm', applications: 50, offers: 10 },
    { time: '5 pm', applications: 48, offers: 12 },
    { time: '6 pm', applications: 55, offers: 14 },
];

// ── Application Trend ──
export const APP_TREND = [
    { period: 'Week 1', count: 8 },
    { period: 'Week 2', count: 12 },
    { period: 'Week 3', count: 15 },
    { period: 'Week 4', count: 22 },
    { period: 'Week 5', count: 18 },
    { period: 'Week 6', count: 28 },
    { period: 'Week 7', count: 35 },
    { period: 'Week 8', count: 42 },
];

// ── Student Detail ──
export const STUDENT_DETAIL = {
    id: 'S-247',
    name: 'Arjun Sharma',
    branch: 'Computer Science & Engineering',
    branchShort: 'CSE B.Tech',
    cgpa: 8.9,
    category: 'Technical',
    lastUpdate: 'Apr 9, 2026',
    status: 'Active',
    readinessScore: 87,
    readinessLevel: 'Very High',
    riskLevel: 'Low Risk',
    domain: 'Software Development Engineering',
    domainDescription: 'The placement cell monitors and supports Arjun\'s preparation for software development roles at top-tier companies. His primary focus areas include data structures, system design, and full-stack development.',
    careerPath: 'SDE-1',
    inherentReadiness: 87,
    residualGap: 15,
    methodology: 'AI-Powered',
    riskSource: 'Technical',
    mentors: [
        { name: 'Dr. Priya Sharma', initials: 'PS', color: '#6366f1' },
        { name: 'Prof. Rajesh Kumar', initials: 'RK', color: '#ec4899' },
        { name: 'Dr. Anita Desai', initials: 'AD', color: '#f59e0b' },
    ],
    coordinators: [
        { name: 'Vikram Mehta', initials: 'VM', color: '#10b981' },
        { name: 'Sneha Patel', initials: 'SP', color: '#8b5cf6' },
        { name: 'Rahul Joshi', initials: 'RJ', color: '#ef4444' },
    ],
    recruiters: [
        { name: 'Amazon HR', initials: 'AH', color: '#f97316' },
        { name: 'Google Recruiting', initials: 'GR', color: '#3b82f6' },
        { name: 'Microsoft Talent', initials: 'MT', color: '#06b6d4' },
        { name: 'Flipkart Campus', initials: 'FC', color: '#a855f7' },
    ],
    tabs: [
        { label: 'Profile', count: null },
        { label: 'Applications', count: 5 },
        { label: 'Skills', count: 8 },
        { label: 'Interviews', count: 3 },
        { label: 'Offers', count: 2 },
    ],
    skillGap: {
        title: 'System Design',
        description: 'Critical gap in distributed systems architecture',
        priority: 5,
        threat: 8,
    },
};

// ── Demo Credentials ──
export const DEMO_CREDENTIALS = {
    student: { email: 'arjun@university.edu', password: 'student123' },
    tpc: { email: 'admin@tpc.edu', password: 'admin123' },
};

// ── Skill Data ──
export const SKILL_DATA = [
    { skill: "Python", you: 85, target: 90 },
    { skill: "DSA", you: 60, target: 85 },
    { skill: "Sys Design", you: 45, target: 80 },
    { skill: "SQL", you: 70, target: 75 },
    { skill: "ML/AI", you: 80, target: 70 },
    { skill: "Communication", you: 55, target: 75 },
];

// ── Roadmap ──
export const ROADMAP = [
    { id: 1, title: "SQL Advanced Queries", due: "Completed", status: "done", desc: "Window functions, CTEs" },
    { id: 2, title: "System Design Mock", due: "TODAY · 6:00 PM", status: "today", desc: "URL shortener design" },
    { id: 3, title: "LeetCode Medium × 50", due: "3 days left", status: "in_progress", desc: "Trees, graphs, DP" },
    { id: 4, title: "STAR Method Prep", due: "1 week", status: "pending", desc: "Behavioral AI coaching" },
];

// ── React Agent Steps ──
export const REACT_STEPS = [
    { phase: "TRIGGER", color: "#f59e0b", code: `check_deadlines() -> interview in 5 days\ncheck_skill_progress() -> Sys Design gap` },
    { phase: "THOUGHT", color: "#10b981", code: `Analyzing: Arjun Sharma\nRisk: System Design gap (45 vs 80)\nAction: schedule_mock_interview` },
    { phase: "ACTION", color: "#6366f1", code: `selected_tool: schedule_mock_interview\nparams: { focus: "system_design", time: "today_18:00" }` },
    { phase: "OBSERVE", color: "#ef4444", code: `result: session booked\nmemory.store() -> vector saved\nrisk_score: 0.55 -> 0.41` },
];

// ── Company Recommendations ──
export const COMPANY_RECS = [
    { name: "Amazon", role: "SDE-1", match: 64, skills: { Python: true, DSA: false, "Sys Design": false, SQL: true } },
    { name: "Google", role: "L3 SWE", match: 52, skills: { Python: true, DSA: false, "Sys Design": false, SQL: true } },
    { name: "Flipkart", role: "SDE-1", match: 78, skills: { Python: true, DSA: true, "Sys Design": false, SQL: true } },
    { name: "NVIDIA", role: "ML Eng", match: 71, skills: { Python: true, "ML/AI": true, "Sys Design": false, SQL: false } },
];

// ── Application Tracker ──
export const APPLICATION_TRACKER = [
    { company: "Amazon", role: "SDE-1", status: "interviewed", date: "Apr 5" },
    { company: "Google", role: "L3 SWE", status: "applied", date: "Apr 3" },
    { company: "Flipkart", role: "SDE-1", status: "offered", date: "Apr 1" },
    { company: "Microsoft", role: "SDE", status: "applied", date: "Apr 7" },
    { company: "NVIDIA", role: "ML Eng", status: "interviewed", date: "Apr 6" },
];

// ── Students List ──
export const STUDENTS = [
    { id: 1, name: "Arjun Sharma", branch: "CSE B.Tech", cgpa: 8.9, risk: "medium", riskScore: 0.48, status: "active", targets: ["Google", "Amazon"], completion: 72, lastActive: "2h ago", applied: 4, interviews: 2, offers: 0 },
    { id: 2, name: "Priya Patel", branch: "CSE B.Tech", cgpa: 9.2, risk: "low", riskScore: 0.12, status: "active", targets: ["NVIDIA", "Microsoft"], completion: 88, lastActive: "1h ago", applied: 6, interviews: 4, offers: 1 },
    { id: 3, name: "Rahul Singh", branch: "ECE B.Tech", cgpa: 7.8, risk: "high", riskScore: 0.82, status: "at_risk", targets: ["TCS", "Infosys"], completion: 23, lastActive: "4d ago", applied: 1, interviews: 0, offers: 0 },
    { id: 4, name: "Sneha Kumar", branch: "MCA", cgpa: 8.4, risk: "medium", riskScore: 0.45, status: "active", targets: ["Flipkart", "Amazon"], completion: 55, lastActive: "1d ago", applied: 3, interviews: 1, offers: 0 },
    { id: 5, name: "Dev Malhotra", branch: "CSE B.Tech", cgpa: 8.1, risk: "medium", riskScore: 0.55, status: "active", targets: ["Google", "Meta"], completion: 41, lastActive: "6h ago", applied: 2, interviews: 1, offers: 0 },
    { id: 6, name: "Ananya Roy", branch: "CSE B.Tech", cgpa: 9.5, risk: "low", riskScore: 0.08, status: "placed", targets: ["Amazon"], completion: 95, lastActive: "30m ago", applied: 8, interviews: 5, offers: 2 },
];

// ── Alerts ──
export const ALERTS = [
    { type: "deadline", text: "Amazon SDE-1 application closes in 2 days", time: "2h ago", urgent: true },
    { type: "inactivity", text: "Rahul Singh hasn't logged in for 4 days", time: "1h ago", urgent: true },
    { type: "milestone", text: "Priya Patel completed 50 LeetCode problems", time: "3h ago", urgent: false },
    { type: "interview", text: "Mock interview scheduled: Arjun @ 6PM today", time: "30m ago", urgent: false },
];

// ── Funnel Steps ──
export const FUNNEL_STEPS = [
    { label: "Skills Extracted", count: 312, color: "#6366f1" },
    { label: "Applications", count: 186, color: "#10b981" },
    { label: "Interviews", count: 94, color: "#f59e0b" },
    { label: "Offers", count: 42, color: "#ef4444" },
];

export const riskColors = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };
export const statusColors = { applied: "#6366f1", interviewed: "#f59e0b", offered: "#10b981" };

// ── Simulated CV extraction data ──
export const EXTRACTED_CV_DATA = {
    name: 'Arjun Sharma',
    email: 'arjun@university.edu',
    education: 'B.Tech Computer Science & Engineering — GPA 8.9/10',
    experience: [
        'Software Intern @ Flipkart (Summer 2025) — Built microservices with Python & Flask',
        'ML Research Assistant @ University Lab — NLP sentiment analysis project',
    ],
    skills: ['Python', 'JavaScript', 'React', 'Flask', 'SQL', 'TensorFlow', 'Git', 'REST APIs'],
    projects: [
        'E-commerce Recommendation Engine — Collaborative filtering with 89% accuracy',
        'Real-time Chat App — WebSocket-based, 500+ concurrent users',
    ],
    certifications: ['AWS Cloud Practitioner', 'Google Data Analytics Professional'],
};

// ── AI follow-up questions based on CV ──
export const AI_PROFILE_QUESTIONS = [
    {
        question: "We noticed Python and Flask in your resume. Have you worked with distributed systems or microservices at scale?",
        options: ["Yes, extensively", "Some experience", "Mostly theoretical", "No experience"],
    },
    {
        question: "Your ML research looks strong! Are you more interested in applied ML roles or core software engineering?",
        options: ["Applied ML/AI", "Core SDE", "Full-stack with ML", "Still exploring"],
    },
    {
        question: "You interned at Flipkart — are you targeting similar product companies, or are you open to startups and consulting firms too?",
        options: ["Top product companies only", "Product + startups", "Open to everything", "Consulting focus"],
    },
    {
        question: "What's your biggest area of concern heading into placement season?",
        options: ["System design interviews", "DSA problem solving", "Behavioral/HR rounds", "Resume gaps"],
    },
];
