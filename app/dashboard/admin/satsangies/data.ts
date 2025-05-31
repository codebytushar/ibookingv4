export const revalidate = 0;
export const fetchCache = 'force-no-store'

import { RoomAllocation } from '@/app/datatypes/custom';
import { sql } from '@vercel/postgres';


export async function getAllSatsangies() {
  const { rows } = await sql`SELECT * FROM satsangies`;
  return rows;
}

export async function getAllSatsangieswithRoomNo() {
  const { rows } = await sql`SELECT * FROM satsangi_cico order by room_no,age`;
  return rows;
}

export async function getAllShivirIds() {
  const { rows } = await sql`SELECT id, occasion FROM shivirs`;
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

export async function getAllocatedSatsangies(roomId: string): Promise<{ id: string; name: string }[]> {
  const { rows } = await sql`
    SELECT s.id, s.name
    FROM Satsangies s
    JOIN Allocations a ON s.id = a.satsangi_id
    WHERE a.room_id = ${roomId};
  `;

  return rows as { id: string; name: string }[];
}  