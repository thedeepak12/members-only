import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { findByUsername, findById, UserRow } from '../models/user.js';

passport.use(
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await findByUsername(username);
        if (!user) return done(null, false);

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return done(null, false);

        return done(null, { id: user.id, username: user.username } as Partial<UserRow>);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await findById(id);
    if (!user) return done(null, false);
    return done(null, { id: user.id, username: user.username });
  } catch (err) {
    return done(err as Error);
  }
});

export default passport;
