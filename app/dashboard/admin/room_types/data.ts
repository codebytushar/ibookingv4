'use server';
import { sql } from '@vercel/postgres';


export async function getAllRoomTypes() {
  const { rows } = await sql`SELECT * FROM room_types`;
  return rows;
}