'use server';


import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShivir(formData: FormData) {
  const occasion = formData.get('occasion') as string;
  const startDate = formData.get('start_date') as string;
  const endDate = formData.get('end_date') as string;
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;
  const mapLink = formData.get('map_link') as string;

  await sql`
    INSERT INTO shivirs (occasion, start_date, end_date, city, address, map_link)
    VALUES (${occasion}, ${startDate}, ${endDate}, ${city}, ${address}, ${mapLink})
  `;

  revalidatePath('/dashboard/admin', 'layout'); // Redirect to the shivirs list page after creation
  
}

export async function deleteShivir(id: number) {
  try {
    await sql`DELETE FROM shivirs WHERE id = ${id}`;
    revalidatePath('/dashboard/admin', 'layout');
  } catch (error) {
    throw error;
  }
}
