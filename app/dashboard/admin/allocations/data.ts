// app/(protected)/room-properties/actions.ts
'use server';

import { sql } from '@vercel/postgres';
import { RoomAllocation } from '@/app/datatypes/custom';

export async function getSatsangies() {
  const { rows } = await sql`
    SELECT id, name, city
    FROM satsangies
    ORDER BY name
  `;
  return rows;
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
