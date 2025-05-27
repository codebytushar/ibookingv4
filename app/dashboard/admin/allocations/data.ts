// app/(protected)/room-properties/actions.ts
'use server';

import { sql } from '@vercel/postgres';
import { UUID } from 'crypto';
import { redirect } from 'next/navigation';

export async function getSatsangies() {
  const { rows } = await sql`
    SELECT id, name, city
    FROM satsangies
    ORDER BY name
  `;
  return rows;
}

export async function getRoomsWithAllocations() {
  const { rows } = await sql`
    SELECT
      r.id,
      rt.description,
      rt.base_capacity,
      rt.extra_capacity,
      COUNT(a.id)::int AS total_allocated
    FROM rooms r
    JOIN room_types rt ON r.room_type_id = rt.id
    LEFT JOIN allocations a ON a.room_id = r.id
    GROUP BY r.id, rt.description, rt.base_capacity, rt.extra_capacity
  `;

  return rows;
}
