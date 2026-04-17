from pydantic import BaseModel, Field
from typing import List, Optional


class SkillScores(BaseModel):
    DSA: int = 0
    SQL: int = 0
    Communication: int = 0
    SystemDesign: int = 0
    Projects: int = 0
    Aptitude: int = 0


class Recommendation(BaseModel):
    id: int
    priority: str
    initials: str
    company: str
    role: str
    match: int
    gaps: List[str]
    reasoning: str
    jd: str
    selectionProbability: int = 50


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = Field(default_factory=list)
    userId: Optional[str] = None


class ChatResponse(BaseModel):
    reply: str


class AgentRunRequest(BaseModel):
    studentId: int


class RiskStudent(BaseModel):
    id: int
    name: str
    branch: str
    riskScore: float
    lastActive: str
    agentMemory: List[str]
    placementStatus: str = "Pending"


class Application(BaseModel):
    company: str
    role: str
    stage: str  # APPLIED, OA, INTERVIEW, OFFER, REJECTED
    date: str
    deadline: Optional[str] = None


class ApplicationCreate(BaseModel):
    userId: str
    company: str
    role: str
    stage: str = 'APPLIED'
    deadline: Optional[str] = None


class SkillMapping(BaseModel):
    company: str
    role: str
    match: int
    gaps: List[str]
    selectionProbability: int


class NextAction(BaseModel):
    id: int
    type: str  # Apply, Upskill, Mock Interview
    text: str


class Alert(BaseModel):
    id: int
    type: str  # urgent, warning, info
    text: str
    time: str
    deadline: Optional[str] = None
    actionText: Optional[str] = None


class JourneyStage(BaseModel):
    name: str
    status: str  # completed, current, pending


class StudentAnalytics(BaseModel):
    placementScore: int
    skillMatchRate: int
    selectionProbability: int
    journeyStage: str
    journeyStages: List[JourneyStage]
    applications: List[Application]
    nextActions: List[NextAction]
    alerts: List[Alert]
    skillMappings: List[SkillMapping]


class BatchMetrics(BaseModel):
    totalStudents: int
    placed: int
    atRisk: int
    activeApplications: int
    avgScore: int
    placementRate: float
    avgPackage: str
    highestPackage: str
    companiesVisiting: int
