import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RecommendationRequest, RecommendationResponse } from '../types';

interface DashboardResponse {
  readonly goals: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly progress: number;
    readonly focusSkills: readonly string[];
  }[];
  readonly employees: readonly {
    readonly id: string;
    readonly name: string;
    readonly currentRole: string;
    readonly targetRole: string;
    readonly readiness: number;
  }[];
}

export const useHrDashboard = (): {
  readonly data: DashboardResponse | undefined;
  readonly isLoading: boolean;
  readonly error: unknown;
} => {
  const { data, isLoading, error } = useQuery<DashboardResponse>({
    queryKey: ['hr-dashboard'],
    queryFn: async () => {
      const response = await axios.get<DashboardResponse>('/api/hr-dashboard');
      return response.data;
    }
  });

  return { data, isLoading, error };
};

export const useRecommendationMutation = (): ReturnType<typeof useMutation<RecommendationResponse, unknown, RecommendationRequest>> => {
  return useMutation<RecommendationResponse, unknown, RecommendationRequest>({
    mutationKey: ['recommendation'],
    mutationFn: async (payload: RecommendationRequest) => {
      const response = await axios.post<RecommendationResponse>('/api/recommendations', payload);
      return response.data;
    }
  });
};
