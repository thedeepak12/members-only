import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, findByEmailOrUsername } from '../models/user.js';

export async function postSignup(req: Request, res: Response, next: NextFunction) {
  const {
    name = '',
    username = '',
    email = '',
    password = '',
  } = (req.body || {}) as Partial<Record<'name' | 'username' | 'email' | 'password', string>>;
  try {
    const existing = await findByEmailOrUsername(email, username);
    if (existing) {
      return res.status(400).render('auth/signup', {
        title: 'Sign Up',
        errors: ['Email or username already exists.'],
        formData: { name, username, email },
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    await createUser({ name, username, email, password_hash });

    return res.redirect('/login');
  } catch (err) {
    return next(err);
  }
}
