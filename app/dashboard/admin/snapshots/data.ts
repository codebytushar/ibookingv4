export const revalidate = 0;

import { sql } from '@vercel/postgres';

export async function getAllSnapshots() {
  const result = await sql`
    SELECT id,  created_at, description
    FROM snapshots
    ORDER BY created_at DESC
  `;
  return result.rows;
}