import { Router } from 'express';
import { validateSignup } from '../middleware/validateForm.js';
import { postSignup } from '../controllers/authController.js';
import passport from '../config/passport.js';

const router = Router();

router.post('/signup', validateSignup, postSignup);

router.get('/login', (req, res) => {
  const { error } = req.query as { error?: string };
  res.render('auth/login', { title: 'Log In', loginError: !!error });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=1',
  })
);

export default router;
