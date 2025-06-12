'use server';

import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { clear } from 'console';

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

  revalidatePath('/dashboard/admin', 'layout');
}

export async function deleteSatsangi(id: string) {
  await sql`DELETE FROM satsangies WHERE id = ${id}`;
  revalidatePath('/dashboard/admin', 'layout');
}

export async function unassignSatsangi(roomId: string, satsangiId: string) {
  try {
    await sql`
      DELETE FROM Allocations
      WHERE room_id = ${roomId} AND satsangi_id = ${satsangiId};
    `;

    revalidatePath('/dashboard/admin', 'layout'); // change if your route is different
  } catch (error) {
    console.error('Failed to unassign satsangi:', error);
    throw error;
  }
}
  

export async function checkInSatsangi(satsangiId: string) {
  await sql`
    INSERT INTO checked_in (satsangi_id, datetime)
    VALUES (${satsangiId}, NOW())
  `;
  revalidatePath('/dashboard/admin', 'layout');
}

export async function checkOutSatsangi(satsangiId: string) {
  await sql`
    INSERT INTO checked_out (satsangi_id, datetime)
    VALUES (${satsangiId}, NOW())
  `;
  await sql`DELETE FROM checked_in WHERE satsangi_id = ${satsangiId}`;
  await sql`DELETE FROM allocations WHERE satsangi_id = ${satsangiId}`;
  revalidatePath('/dashboard/admin', 'layout');
}

export async function updateSatsangi(formData: FormData) {
  console.log('Updating satsangi with form data:', formData);
  const rawFormData = {
    id: formData.get('id') as string,
    payment_id: formData.get('payment_id') as string,
    age: parseInt(formData.get('age') as string),
    gender: formData.get('gender') as string,
    city: formData.get('city') as string,
    checked_in: formData.get('check_status') === 'checkin',
    checked_out: formData.get('checked_out') === 'checkout',
    clear: formData.get('check_status') === 'clear',
  };
console.log('Parsed raw form data:', rawFormData);
  try {
    await sql`
      UPDATE satsangies 
      SET 
        payment_id = ${rawFormData.payment_id},
        age = ${rawFormData.age},
        gender = ${rawFormData.gender},
        city = ${rawFormData.city}
      WHERE id = ${rawFormData.id}
    `;

    if (rawFormData.checked_in && !rawFormData.checked_out) {
       await sql`
        DELETE FROM checked_in WHERE satsangi_id = ${rawFormData.id};
      `;
      await checkInSatsangi(rawFormData.id);
    } else if (rawFormData.checked_out) {
       await sql`
        DELETE FROM checked_out WHERE satsangi_id = ${rawFormData.id};
        `;
      await checkOutSatsangi(rawFormData.id);
    } else if (!rawFormData.checked_in && !rawFormData.checked_out) {
      await sql`
        DELETE FROM checked_in WHERE satsangi_id = ${rawFormData.id};
      `;
      await sql`
        DELETE FROM checked_out WHERE satsangi_id = ${rawFormData.id};
        `;
    }
    revalidatePath('/dashboard/admin', 'layout');
  } catch (error) {
    console.error('Failed to update satsangi:', error);
    throw new Error('Failed to update satsangi');
  }
}  
