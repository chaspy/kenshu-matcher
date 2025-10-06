import { Router } from 'express';
import recommendationService from '../services/recommendationService';
import { RecommendationRequestBody } from '../types';

const recommendationRoute = Router();

const isValidRequest = (body: RecommendationRequestBody | undefined): body is RecommendationRequestBody => {
  return (
    body !== undefined &&
    Array.isArray(body.goals) &&
    body.goals.length > 0 &&
    Array.isArray(body.focusSkillIds)
  );
};

recommendationRoute.post('/', async (request, response) => {
  const body = request.body as RecommendationRequestBody | undefined;

  if (!isValidRequest(body)) {
    response.status(400).json({ message: 'Invalid request body' });
    return;
  }

  try {
    const result = await recommendationService.generateRecommendation(body);
    response.json(result);
  } catch (error) {
    response.status(500).json({
      message: 'Failed to generate recommendation',
      detail: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default recommendationRoute;
