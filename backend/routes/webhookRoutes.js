import express from 'express';
import { handleShiprocketWebhook } from '../controllers/webhookController.js';

const webhookRouter = express.Router();
webhookRouter.post('/order-updates', handleShiprocketWebhook); // matches the URL

export default webhookRouter;