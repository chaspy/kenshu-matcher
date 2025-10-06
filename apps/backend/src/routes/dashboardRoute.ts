import { Router } from 'express';
import { getHrDashboard } from '../services/dashboardService';

const dashboardRoute = Router();

dashboardRoute.get('/', async (_request, response) => {
  const dashboard = await getHrDashboard();
  response.json(dashboard);
});

export default dashboardRoute;
