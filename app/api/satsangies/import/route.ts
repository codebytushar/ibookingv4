import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const satsangies = await req.json();

  try {
    for (const s of satsangies) {
      await sql`
        INSERT INTO satsangies (
          id, name, age, city, state, birthdate, panno, address,
          mobile, email, gender, shivir_id, payment_id
        )
        VALUES (
          ${uuidv4()}, ${s.name}, ${s.age || null}, ${s.city}, ${s.state || null},
          ${s.birthdate || null}, ${s.panno || null}, ${s.address || null},
          ${s.mobile || null}, ${s.email || null}, ${s.gender || null},
          ${s.shivir_id || null}, ${s.payment_id || null}
        )
      `;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Import error:', err);
    return NextResponse.json({ error: 'Failed to import' }, { status: 500 });
  }
}
