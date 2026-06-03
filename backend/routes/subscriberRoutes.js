import express from 'express';
import { addSubscriber, getSubscribers, removeSubscriber } from '../controllers/subscriberController.js';


const subscribeRoutes = express.Router();

subscribeRoutes.get('/subscribers', getSubscribers);
subscribeRoutes.post('/subscribe', addSubscriber);
subscribeRoutes.delete('/unsubscribe/:id', removeSubscriber);


export default subscribeRoutes;