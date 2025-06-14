'use server';
// app/(protected)/room-properties/data.ts
import { sql } from '@vercel/postgres';


export async function getAllRoomProperties() {
  const { rows } = await sql`
    SELECT id, shivir_id, name, address, map_link, city, state, pin
    FROM room_properties
    ORDER BY id DESC
    LIMIT 50
  `;
  return rows;
}

export async function getAllShivirIds() {
  const { rows } = await sql`
    SELECT id, occasion FROM shivirs ORDER BY start_date DESC
  `;
  return rows;
}
