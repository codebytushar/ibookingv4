'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export async function getAllRoomTypes() {
  const { rows } = await sql`SELECT * FROM room_types`;
  return rows;
}

export async function createRoomType(formData: FormData) {
  const id = uuidv4();
  const description = formData.get('description') as string;
  const base_capacity = Number(formData.get('base_capacity'));
  const extra_capacity = Number(formData.get('extra_capacity'));
  const property_id = formData.get('property_id') as string;
  const total_rooms = Number(formData.get('total_rooms'));
  console.log('Creating Room Type:', {
    id,
    description,
    base_capacity,
    extra_capacity,
    property_id,
    total_rooms,
  });
  await sql`
    INSERT INTO room_types (id, description, base_capacity, extra_capacity, property_id, total_rooms)
    VALUES (${id}, ${description}, ${base_capacity}, ${extra_capacity}, ${property_id}, ${total_rooms})
  `;

  revalidatePath('/dashboard/admin/room_types');
}

export async function deleteRoomType(id: string) {
  try {
    await sql`DELETE FROM room_types WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/room_types');
  } catch (error) {
    throw error;
  }
}
export async function updateRoomType(id: string, formData: FormData) {
  const description = formData.get('description') as string;
  const base_capacity = Number(formData.get('base_capacity'));
  const extra_capacity = Number(formData.get('extra_capacity'));
  const property_id = formData.get('property_id') as string;
  const total_rooms = Number(formData.get('total_rooms'));

  await sql`
    UPDATE room_types
    SET
      description = ${description},
      base_capacity = ${base_capacity},
      extra_capacity = ${extra_capacity},
      property_id = ${property_id},
      total_rooms = ${total_rooms}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/admin/room_types');
}