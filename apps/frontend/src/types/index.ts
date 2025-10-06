export type Persona = 'hr' | 'employee';

export interface CareerGoal {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly targetSkills: readonly string[];
}

export interface TrainingRecommendation {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly relevance: number;
}

export interface RecommendationRequest {
  readonly persona: Persona;
  readonly goals: readonly CareerGoal[];
  readonly focusSkillIds: readonly string[];
  readonly employeeProfile?: EmployeeProfile;
}

export interface EmployeeProfile {
  readonly name: string;
  readonly currentRole: string;
  readonly aspiration: string;
  readonly strengths: readonly string[];
  readonly growthAreas: readonly string[];
}

export interface RecommendationResponse {
  readonly trainings: readonly TrainingRecommendation[];
  readonly summary: string;
}
