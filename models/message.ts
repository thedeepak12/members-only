import pool from '../config/database.js';

export interface MessageRow {
  id: number;
  user_id: number;
  content: string;
  created_at: Date;
  name?: string;
}

export async function listMessages(): Promise<MessageRow[]> {
  const { rows } = await pool.query<MessageRow>(
    `SELECT m.id, m.user_id, m.content, m.created_at, u.name
     FROM messages m
     JOIN users u ON u.id = m.user_id
     ORDER BY m.created_at`
  );
  return rows;
}

export async function createMessage(userId: number, content: string): Promise<void> {
  await pool.query(
    'INSERT INTO messages (user_id, content) VALUES ($1, $2)',
    [userId, content]
  );
}
