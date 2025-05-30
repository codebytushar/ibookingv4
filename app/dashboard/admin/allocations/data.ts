'use server';
import { sql } from '@vercel/postgres';
import { RoomAllocation } from '@/app/datatypes/custom';
import { Satsangi } from '@/app/datatypes/schema';

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
  COUNT(a.id)::int AS total_allocated,
  COUNT(DISTINCT ci.satsangi_id)::int AS checked_in_count
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
LEFT JOIN allocations a ON a.room_id = r.id
LEFT JOIN checked_in ci ON ci.satsangi_id = a.satsangi_id
GROUP BY r.id, rt.description, rt.base_capacity, rt.extra_capacity
ORDER BY r.floor, r.room_no;
  `;
  return rooms.rows;
}

export async function getUnassignedSatsangies(): Promise<Satsangi[]> {
  const result = await sql<Satsangi>`
    SELECT s.id, s.name, s.city, s.age
    FROM satsangies s
    WHERE s.id NOT IN (
      SELECT a.satsangi_id
      FROM allocations a
    )
  `;
  return result.rows;
}

