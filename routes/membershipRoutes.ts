import { Router, Request, Response } from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { setMembershipStatus } from '../models/user.js';

const router = Router();

router.get('/membership', isAuthenticated, (req: Request, res: Response) => {
  res.render('auth/membership', { title: 'Membership' });
});

router.post('/membership', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { code } = req.body as { code?: string };
    const membershipCode = process.env.MEMBERSHIP_CODE;

    if (!membershipCode) {
      return res.status(500).render('auth/membership', {
        title: 'Membership',
        error: 'Membership code is not configured. Please contact support.',
      });
    }

    if (!code || code.trim() !== membershipCode) {
      return res.status(400).render('auth/membership', {
        title: 'Membership',
        error: 'Invalid code. Please try again.',
      });
    }

    const userId = (req.user as any)?.id;
    if (!userId) return res.redirect('/login');

    await setMembershipStatus(Number(userId), true);

    return res.redirect('/');
  } catch (err) {
    return res.status(500).render('auth/membership', {
      title: 'Membership',
      error: 'Something went wrong. Please try again later.',
    });
  }
});

export default router;
