export const revalidate = 0;
export const fetchCache = 'force-no-store'
import { sql } from '@vercel/postgres';


export async function getAllRoomTypes() {
  const { rows } = await sql`SELECT * FROM room_types`;
  return rows;
}