import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const { satsangi_id, room_id } = await req.json();

    if (!satsangi_id || !room_id) {
      return NextResponse.json({ error: 'Missing satsangi_id or room_id' }, { status: 400 });
    }

    // Fetch base/extra capacity of the room (via join)
    const { rows: capacityRows } = await sql`
      SELECT rt.base_capacity, rt.extra_capacity
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      WHERE r.id = ${room_id}
      LIMIT 1;
    `;

    if (capacityRows.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const { base_capacity, extra_capacity } = capacityRows[0];
    const totalCapacity = base_capacity + extra_capacity;

    // Get current number of allocations in this room
    const { rows: allocationRows } = await sql`
      SELECT COUNT(*)::int AS count
      FROM allocations
      WHERE room_id = ${room_id};
    `;

    const currentCount = allocationRows[0]?.count ?? 0;

    if (currentCount >= totalCapacity) {
      return NextResponse.json({ error: 'Room is full' }, { status: 400 });
    }

    // Insert allocation
    const allocationId = uuidv4();
    await sql`
      INSERT INTO allocations (id, satsangi_id, room_id)
      VALUES (${allocationId}, ${satsangi_id}, ${room_id});
    `;

    return NextResponse.json({ message: 'Allocation successful' });
  } catch (error) {
    console.error('Allocation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
