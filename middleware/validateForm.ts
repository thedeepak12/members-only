import { Request, Response, NextFunction } from 'express';

export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const {
    name = '',
    username = '',
    email = '',
    password = '',
    confirmPassword = '',
  } = (req.body || {}) as Record<string, string>;

  if (!confirmPassword || confirmPassword !== password) {
    return res.status(400).render('auth/signup', {
      title: 'Sign Up',
      confirmError: 'Passwords do not match.',
      formData: { name, username, email },
    });
  }

  return next();
}
