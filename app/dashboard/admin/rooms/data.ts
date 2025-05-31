export const revalidate = 0;
export const fetchCache = 'force-no-store'
import { sql } from '@vercel/postgres';


export async function getAllRooms() {
  const { rows } = await sql`SELECT * FROM rooms`;
  return rows;
}

export async function getAllRoomTypeOptions() {
  const { rows } = await sql`SELECT id, description FROM room_types`;
  return rows;
}