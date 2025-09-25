import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import './config/database.js';
import authRoutes from './routes/authRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import session from 'express-session';
import passport from './config/passport.js';
import { listMessages } from './models/message.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/utils', express.static('dist/utils'));
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET is not set in the environment');
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);
app.use(membershipRoutes);
app.use(messageRoutes);

app.get('/', async (req: Request, res: Response) => {
  const isAuthed = typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated();
  if (!isAuthed) {
    return res.redirect('/login');
  }
  const messages = await listMessages();
  const isMember = Boolean((req as any)?.user?.is_member);
  res.render('layouts/main', { title: 'Messages', messages, isMember });
});

app.get('/signup', (_req: Request, res: Response) => {
  res.render('auth/signup', { title: 'Sign Up' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
