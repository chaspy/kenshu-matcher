import express from 'express';
import { PORT } from './config';
import recommendationRoute from './routes/recommendationRoute';
import dashboardRoute from './routes/dashboardRoute';
import { ensureSeedData } from './services/catalogService';

const bootstrap = async (): Promise<void> => {
  await ensureSeedData();

  const app = express();
  app.use(express.json());

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/recommendations', recommendationRoute);
  app.use('/api/hr-dashboard', dashboardRoute);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.error(`API server is running at http://localhost:${PORT}`);
  });
};

void bootstrap();
