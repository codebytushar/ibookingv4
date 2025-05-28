import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT s.id, s.name, s.city, s.age
      FROM satsangies s
      LEFT JOIN allocations a ON a.satsangi_id = s.id
      WHERE a.id IS NULL
      ORDER BY s.name
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch unassigned satsangies' },
      { status: 500 }
    );
  }
}