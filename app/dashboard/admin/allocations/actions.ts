'use server';

import { sql } from '@vercel/postgres';
import { RoomAllocation } from '@/app/datatypes/custom';
import { Satsangi } from '@/app/datatypes/schema';
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
        revalidatePath('/dashboard/admin/satsangies/allocations');
        return { success: true };
    } catch (error) {
        await sql`ROLLBACK`;
        return { success: false, error: 'Failed to create allocations' };
    }
}