export const revalidate = 0;
export const fetchCache = 'force-no-store'
import { sql } from '@vercel/postgres';

export async function getAllShivirs() {
  const { rows } = await sql`
    SELECT id, occasion, start_date, end_date, city, address, map_link
    FROM shivirs
    ORDER BY id
    LIMIT 50
  `;
  return rows;
}
