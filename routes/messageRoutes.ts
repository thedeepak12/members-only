import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { listMessages, createMessage } from '../models/message.js';

const router = Router();

router.get('/messages', async (_req: Request, res: Response) => {
  const messages = await listMessages();
  res.render('messages/messageList', { title: 'Messages', messages });
});

router.post('/messages', isAuthenticated, async (req: Request, res: Response) => {
  const { content } = req.body as { content?: string };
  const userId = (req.user as any)?.id;

  if (!userId) return res.redirect('/login');
  if (!content) {
    return res.status(400).redirect('/messages');
  }

  await createMessage(Number(userId), content.trim());
  res.redirect('/messages');
});

export default router;
