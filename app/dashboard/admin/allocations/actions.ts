'use server';
// This file contains server actions for bulk allocation of satsangis to rooms
// in a Next.js application using Vercel Postgres.


import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

export async function assignbulk(
    roomId: string,
    satsangiIds: string[]
): Promise<{ success: boolean; error?: string }> {
    try {
        // Create a transaction for bulk insert
        await sql`BEGIN`;
        for (const satsangiId of satsangiIds) {
            await sql`
        INSERT INTO allocations (room_id, satsangi_id)
        VALUES (${roomId}, ${satsangiId})
      `;
        }
        await sql`COMMIT`;
        revalidatePath('/dashboard/admin', 'layout');
        return { success: true };
    } catch (error) {
        await sql`ROLLBACK`;
        return { success: false, error: 'Failed to create allocations' };
    }
}