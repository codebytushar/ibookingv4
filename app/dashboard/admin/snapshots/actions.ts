'use server';


import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';



export async function createSnapshot(description: string | null){



const snapshot = await sql`
    INSERT INTO snapshots (id, description, created_at)
    VALUES (gen_random_uuid(), ${description}, NOW())
    RETURNING id
`;
  const snapshotId = snapshot.rows[0].id;

  // Now insert into all snapshot tables
  await sql`
    INSERT INTO snapshot_satsangies
    SELECT ${snapshotId}, id, name, age, city, state, birthdate::date, panno, address, mobile, email, gender, shivir_id, payment_id
    FROM satsangies
  `;

  await sql`
    INSERT INTO snapshot_shivirs
    SELECT ${snapshotId}, id, occasion, start_date::date, end_date::date, city, address, map_link
    FROM shivirs
  `;

  await sql`
    INSERT INTO snapshot_room_properties
    SELECT ${snapshotId}, id, shivir_id, name, address, map_link, city, state, pin
    FROM room_properties
  `;

  await sql`
    INSERT INTO snapshot_room_types
    SELECT ${snapshotId}, id, description, base_capacity, extra_capacity, total_rooms, property_id
    FROM room_types
  `;

  await sql`
    INSERT INTO snapshot_rooms
    SELECT ${snapshotId}, id, room_type_id, room_no, floor, status
    FROM rooms
  `;

  await sql`
    INSERT INTO snapshot_allocations
    SELECT ${snapshotId}, id, room_id, satsangi_id
    FROM allocations
  `;

  await sql`
  INSERT INTO snapshot_checked_in
  SELECT ${snapshotId}, id, satsangi_id, (NOW()::date + datetime::time)
  FROM checked_in
`;

await sql`
  INSERT INTO snapshot_checked_out
  SELECT ${snapshotId}, id, satsangi_id, (NOW()::date + datetime::time)
  FROM checked_out
`;
revalidatePath('/dashboard/admin', 'layout');
}

export async function deleteSnapshot(id: string) {
  // Delete snapshot and its related data
  await sql`DELETE FROM snapshot_checked_in WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_checked_out WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_allocations WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_rooms WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_room_types WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_room_properties WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_shivirs WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshot_satsangies WHERE snapshot_id = ${id}`;
  await sql`DELETE FROM snapshots WHERE id = ${id}`;
  revalidatePath('/dashboard/admin', 'layout');
}

export async function restoreSnapshot(snapshotId: string) {
  // ⚠️ Clear live tables — if safe
  await sql`DELETE FROM checked_out`;
  await sql`DELETE FROM checked_in`;
  await sql`DELETE FROM allocations`;
  await sql`DELETE FROM rooms`;
  await sql`DELETE FROM room_types`;
  await sql`DELETE FROM room_properties`;
  await sql`DELETE FROM satsangies`;
  await sql`DELETE FROM shivirs`;

  // ✅ Restore from snapshot tables

    await sql`
    INSERT INTO shivirs (id, occasion, start_date, end_date, city, address, map_link)
    SELECT id, occasion, start_date, end_date, city, address, map_link
    FROM snapshot_shivirs
    WHERE snapshot_id = ${snapshotId}
  `;
  
  await sql`
    INSERT INTO satsangies (id, name, age, city, state, birthdate, panno, address, mobile, email, gender, shivir_id, payment_id)
    SELECT id, name, age, city, state, birthdate, panno, address, mobile, email, gender, shivir_id, payment_id
    FROM snapshot_satsangies
    WHERE snapshot_id = ${snapshotId}
  `;



  await sql`
    INSERT INTO room_properties (id, shivir_id, name, address, map_link, city, state, pin)
    SELECT id, shivir_id, name, address, map_link, city, state, pin
    FROM snapshot_room_properties
    WHERE snapshot_id = ${snapshotId}
  `;

  await sql`
    INSERT INTO room_types (id, description, base_capacity, extra_capacity, total_rooms, property_id)
    SELECT id, description, base_capacity, extra_capacity, total_rooms, property_id
    FROM snapshot_room_types
    WHERE snapshot_id = ${snapshotId}
  `;

  await sql`
    INSERT INTO rooms (id, room_type_id, room_no, floor, status)
    SELECT id, room_type_id, room_no, floor, status
    FROM snapshot_rooms
    WHERE snapshot_id = ${snapshotId}
  `;

  await sql`
    INSERT INTO allocations (id, room_id, satsangi_id)
    SELECT id, room_id, satsangi_id
    FROM snapshot_allocations
    WHERE snapshot_id = ${snapshotId}
  `;

  await sql`
    INSERT INTO checked_in (id, satsangi_id, datetime)
    SELECT id, satsangi_id, datetime
    FROM snapshot_checked_in
    WHERE snapshot_id = ${snapshotId}
  `;

  await sql`
    INSERT INTO checked_out (id, satsangi_id, datetime)
    SELECT id, satsangi_id, datetime
    FROM snapshot_checked_out
    WHERE snapshot_id = ${snapshotId}
  `;

  revalidatePath('/dashboard/admin', 'layout');
}

export async function emptyDatabase() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }
  
  try {
    // Delete child → parent order to avoid FK constraint errors
    await sql`DELETE FROM checked_out;`;
    await sql`DELETE FROM checked_in;`;
    await sql`DELETE FROM allocations;`;
    await sql`DELETE FROM rooms;`;
    await sql`DELETE FROM room_types;`;
    await sql`DELETE FROM room_properties;`;
    await sql`DELETE FROM satsangies;`;
    await sql`DELETE FROM shivirs;`;
    revalidatePath('/dashboard/admin', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to empty database:', error);
    return { success: false, error: error.message };
  }

}


