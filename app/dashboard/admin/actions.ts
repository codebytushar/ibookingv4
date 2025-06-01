'use server';

import { sql } from '@vercel/postgres';

export async function getDashboardStats() {
    const [
        totalCapacity,
        registered,
        allocated,
        checkedIn,
        unregistered,
        actualAvailable,
        unallocatedSatsangies
    ] = await Promise.all([
        sql`WITH capacities AS (
            SELECT 
                (rt.base_capacity + rt.extra_capacity) * COUNT(r.id) AS capacity
            FROM room_types rt
            JOIN rooms r ON r.room_type_id = rt.id
            GROUP BY rt.id, rt.base_capacity, rt.extra_capacity
            )
            SELECT COALESCE(SUM(capacity), 0) AS value
            FROM capacities`,
        sql`SELECT COUNT(*) AS value FROM satsangies WHERE payment_id IS NOT NULL`,
        sql`SELECT COUNT(DISTINCT satsangi_id) AS value FROM allocations`,
        sql`SELECT COUNT(DISTINCT satsangi_id) AS value FROM checked_in`,
        sql`SELECT COUNT(*) AS value FROM satsangies WHERE payment_id IS NULL`,
        sql`
  WITH capacities AS (
    SELECT 
      (rt.base_capacity + rt.extra_capacity) * COUNT(r.id) AS capacity
    FROM room_types rt
    JOIN rooms r ON r.room_type_id = rt.id
    GROUP BY rt.id, rt.base_capacity, rt.extra_capacity
  )
  SELECT 
    COALESCE(SUM(capacity), 0) - 
    COALESCE((SELECT COUNT(DISTINCT satsangi_id) FROM checked_in), 0) AS value
  FROM capacities
`,sql`
  SELECT COUNT(*) AS value
  FROM satsangies s
  WHERE s.id NOT IN (
      SELECT satsangi_id FROM allocations
    )
`,
    ]);

    return {
        totalCapacity: totalCapacity.rows[0].value,
        registered: registered.rows[0].value,
        allocated: allocated.rows[0].value,
        checkedIn: checkedIn.rows[0].value,
        unregistered: unregistered.rows[0].value,
        actualAvailable: actualAvailable.rows[0].value,
        unallocatedSatsangies: unallocatedSatsangies.rows[0].value
    };
}
