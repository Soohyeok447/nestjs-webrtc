import { Router } from 'express';
import HealthController from '../controllers/healthController';

const healthRouter = Router();

// health check
healthRouter.get('/', HealthController.healthCheck);

export default healthRouter;