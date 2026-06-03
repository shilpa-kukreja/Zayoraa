import { contactmessage, deleteContact, getAllContacts } from '../controllers/contactController.js';
import express from 'express';



const contactRouter = express.Router();

contactRouter.post('/contact', contactmessage);
contactRouter.get("/contacts", getAllContacts);
contactRouter.delete("/contacts/:id", deleteContact);


export default contactRouter;

