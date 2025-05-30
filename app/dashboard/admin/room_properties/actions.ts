// app/(protected)/room-properties/actions.ts
'use server';

import { sql } from '@vercel/postgres';
import { UUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getAllRoomProperties() {
  const { rows } = await sql`SELECT * FROM room_properties`;
  return rows;
}

export async function createRoomProperty(formData: FormData) {
  const shivir_id = formData.get('shivir_id') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const map_link = formData.get('map_link') as string | null;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const pin = formData.get('pin') as string;

  await sql`
    INSERT INTO room_properties (shivir_id, name, address, map_link, city, state, pin)
    VALUES (${shivir_id}, ${name}, ${address}, ${map_link}, ${city}, ${state}, ${pin})
  `;

  revalidatePath('/dashboard/admin/room_properties'); // Reload the page
}

export async function deleteRoomProperty(id: number) {
  try {
    await sql`DELETE FROM room_properties WHERE id = ${id}`;
    revalidatePath('/dashboard/admin/room_properties'); // Reload the page
  } catch (error) {
    // Optionally, you can throw the error or handle it as needed
    throw error;
  }
}

export async function updateRoomProperty(id: number, formData: FormData) {
  const shivir_id = formData.get('shivir_id') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const map_link = formData.get('map_link') as string | null;
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const pin = formData.get('pin') as string;
  await sql`
    UPDATE room_properties
    SET
      shivir_id = ${shivir_id},
      name = ${name},
      address = ${address},
      map_link = ${map_link},
      city = ${city},
      state = ${state},
      pin = ${pin}
    WHERE id = ${id}
  `;

 redirect('/dashboardd/admin/room-properties'); // Reload the page

}
