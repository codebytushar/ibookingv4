'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';



export async function createRoom(formData: FormData) {
  const id = uuidv4();
  const room_type_id = formData.get('room_type_id') as string;
  const room_no = formData.get('room_no') as string;
  const floor = Number(formData.get('floor'));
  const status = formData.get('status') as string;
  // Check total rooms for the given room_type_id
  const { rows: existingRooms } = await sql`
    SELECT COUNT(*)::int AS count FROM rooms WHERE room_type_id = ${room_type_id}
  `;
  const totalRooms = existingRooms[0]?.count ?? 0;
  const { rows: roomTypeRows } = await sql`
    SELECT total_rooms::int AS total_rooms FROM room_types WHERE id = ${room_type_id}
  `;
  const allowedRooms = roomTypeRows[0]?.total_rooms ?? 0;

  if (totalRooms >= allowedRooms) {
    throw new Error('Room limit reached for this type');
  }

  await sql`
    INSERT INTO rooms (id, room_type_id, room_no, floor, status)
    VALUES (${id}, ${room_type_id}, ${room_no}, ${floor}, ${status})
  `;

  revalidatePath('/dashboard/admin', 'layout');
}

export async function deleteRoom(id: string) {
  try {
    await sql`DELETE FROM rooms WHERE id = ${id}`;
    revalidatePath('/dashboard/admin', 'layout');
  } catch (error) {
    throw error;
  }
}

export async function updateRoom(id: string, formData: FormData) {
  const room_type_id = formData.get('room_type_id') as string;
  const room_no = formData.get('room_no') as string;
  const floor = Number(formData.get('floor'));
  const status = formData.get('status') as string;

  await sql`
    UPDATE rooms
    SET
      room_type_id = ${room_type_id},
      room_no = ${room_no},
      floor = ${floor},
      status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/admin', 'layout');
} 
