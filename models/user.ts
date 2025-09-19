import pool from '../config/database.js';

export interface NewUser {
  name: string;
  username: string;
  email: string;
  password_hash: string;
}

export interface UserRow {
  id: number;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  is_member: boolean;
}

export async function findByEmailOrUsername(email: string, username: string): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    'SELECT * FROM users WHERE email = $1 OR username = $2 LIMIT 1',
    [email, username]
  );
  return rows[0] ?? null;
}

export async function createUser(data: NewUser): Promise<UserRow> {
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (name, username, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, username, email, password_hash, is_member`,
    [data.name, data.username, data.email, data.password_hash]
  );
  if (!rows[0]) {
    throw new Error('Failed to create user');
  }
  return rows[0];
}
