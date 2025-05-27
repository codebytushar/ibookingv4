'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function getAllSatsangies() {
  const { rows } = await sql`SELECT * FROM satsangies`;
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

  await sql`
    INSERT INTO satsangies (
      id, name, age, city, state, birthdate, panno,
      address, mobile, email, gender
    ) VALUES (
      ${id}, ${name}, ${age || null}, ${city}, ${state || null}, ${birthdate || null}, ${panno || null},
      ${address || null}, ${mobile || null}, ${email || null}, ${gender || null}
    )
  `;

  revalidatePath('/dashboard/admin/satsangies');
}

export async function deleteSatsangi(id: string) {
  await sql`DELETE FROM satsangies WHERE id = ${id}`;
  revalidatePath('/dashboard/admin/satsangies');
}
