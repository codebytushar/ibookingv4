import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { roomId, satsangiIds } = await request.json();
    
    // Create a transaction for bulk insert
    try {
      await sql`BEGIN`;
      for (const satsangiId of satsangiIds) {
        await sql`
          INSERT INTO allocations (room_id, satsangi_id)
          VALUES (${roomId}, ${satsangiId})
        `;
      }
      await sql`COMMIT`;
    } catch (err) {
      await sql`ROLLBACK`;
      throw err;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create allocations' },
      { status: 500 }
    );
  }
}