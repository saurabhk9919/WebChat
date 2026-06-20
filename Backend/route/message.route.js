 import express from 'express';
import { sendMessage, getMessages, getConversationSummary } from '../controller/message.controller.js';
import secureRoute from '../middleware/secureRoute.js';

 const router = express.Router();
 router.post("/send/:id",secureRoute, sendMessage);
 router.get("/get/:id", secureRoute, getMessages);
 router.post("/summary/:conversationId", secureRoute, getConversationSummary);

 export default router;