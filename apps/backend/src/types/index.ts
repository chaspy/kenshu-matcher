export interface CareerGoal {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetSkills: readonly string[];
}

export interface EmployeeProfile {
  readonly name: string;
  readonly currentRole: string;
  readonly aspiration: string;
  readonly strengths: readonly string[];
  readonly growthAreas: readonly string[];
}

export interface RecommendationRequestBody {
  readonly persona: 'hr' | 'employee';
  readonly goals: readonly CareerGoal[];
  readonly focusSkillIds: readonly string[];
  readonly employeeProfile?: EmployeeProfile;
}

export interface TrainingRecommendation {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly relevance: number;
}

export interface RecommendationPayload {
  readonly summary: string;
  readonly trainings: readonly TrainingRecommendation[];
}

export interface DashboardGoal {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly progress: number;
  readonly focusSkills: readonly string[];
}

export interface DashboardEmployee {
  readonly id: string;
  readonly name: string;
  readonly currentRole: string;
  readonly targetRole: string;
  readonly readiness: number;
}

export interface HrDashboardResponse {
  readonly goals: readonly DashboardGoal[];
  readonly employees: readonly DashboardEmployee[];
}
