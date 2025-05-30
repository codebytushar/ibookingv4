'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllRooms() {
  const { rows } = await sql`SELECT * FROM rooms`;
  return rows;
}

export async function getAllRoomTypeOptions() {
  const { rows } = await sql`SELECT id, description FROM room_types`;
  return rows;
}

export async function createRoom(formData: FormData) {
  const id = uuidv4();
  const room_type_id = formData.get('room_type_id') as string;
  const room_no = formData.get('room_no') as string;
  const floor = Number(formData.get('floor'));
  const status = formData.get('status') as string;

  await sql`
    INSERT INTO rooms (id, room_type_id, room_no, floor, status)
    VALUES (${id}, ${room_type_id}, ${room_no}, ${floor}, ${status})
  `;

  revalidatePath('/dashboard/admin/rooms');
}

export async function deleteRoom(id: string) {
  try {
    await sql`DELETE FROM rooms WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/rooms');
  } catch (error) {
    throw error;
  }
}
