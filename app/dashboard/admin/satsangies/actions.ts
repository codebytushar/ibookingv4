'use server';

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { RoomAllocation, SatsangiWithRoom } from '@/app/datatypes/custom';

export async function getAllSatsangies() {
  const { rows } = await sql`SELECT * FROM satsangies`;
  return rows;
}

export async function getAllSatsangieswithRoomNo() {
  const { rows } = await sql`SELECT * FROM satsangi_room_allocation`;
  return rows;
}

export async function getAllShivirIds() {
  const { rows } = await sql`SELECT id, occasion FROM shivirs`;
  return rows;
}

export async function createSatsangi(formData: FormData) {
  const id = uuidv4();
  const name = formData.get('name') as string;
  const age = Number(formData.get('age'));
  const city = formData.get('city') as string;
  const state = formData.get('state') as string;
  const birthdate = formData.get('birthdate') as string;
  const panno = formData.get('panno') as string;
  const address = formData.get('address') as string;
  const mobile = formData.get('mobile') as string;
  const email = formData.get('email') as string;
  const gender = formData.get('gender') as string;
  const shivir_id = formData.get('shivir_id') as string;
  const payment_id = Number(formData.get('payment_id'));

  await sql`
    INSERT INTO satsangies (
      id, name, age, city, state, birthdate, panno,
      address, mobile, email, gender, shivir_id, payment_id
    ) VALUES (
      ${id}, ${name}, ${age || null}, ${city}, ${state || null}, ${birthdate || null}, ${panno || null},
      ${address || null}, ${mobile || null}, ${email || null}, ${gender || null},
      ${shivir_id || null}, ${payment_id || null}
    )
  `;

  revalidatePath('/dashboard/admin/satsangies');
}

export async function deleteSatsangi(id: string) {
  await sql`DELETE FROM satsangies WHERE id = ${id}`;
  revalidatePath('/dashboard/admin/satsangies');
}

export async function getRoomsWithAllocations() {
  const  rooms  = await sql<RoomAllocation[]>`
    SELECT
    r.id,
      r.room_no,
      r.floor,
      r.status,
      rt.description,
      rt.base_capacity,
      rt.extra_capacity,
      COUNT(a.id)::int AS total_allocated
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.id
    LEFT JOIN allocations a ON a.room_id = r.id
    GROUP BY r.id, rt.description, rt.base_capacity, rt.extra_capacity
    order by r.floor, r.room_no
  `;
  return rooms.rows;
}


export async function unassignSatsangi(roomId: string, satsangiId: string) {
  try {
    await sql`
      DELETE FROM Allocations
      WHERE room_id = ${roomId} AND satsangi_id = ${satsangiId};
    `;

    revalidatePath('/dashboard/admin/allocations'); // change if your route is different
  } catch (error) {
    console.error('Failed to unassign satsangi:', error);
    throw error;
  }
}



  export async function getAllocatedSatsangies(roomId: string): Promise<{ id: string; name: string }[]> {
  const { rows } = await sql`
    SELECT s.id, s.name
    FROM Satsangies s
    JOIN Allocations a ON s.id = a.satsangi_id
    WHERE a.room_id = ${roomId};
  `;

  return rows as { id: string; name: string }[];
}  
  
