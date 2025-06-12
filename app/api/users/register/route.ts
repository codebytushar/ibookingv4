import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
           const userId = (await sql`SELECT gen_random_uuid() AS id`).rows[0].id;
    // Hash password
    const hashedPassword = await bcrypt.hash('xyz', 10);

    // Insert into users table
    await sql`
      INSERT INTO users (id, name, email, password,role)
      VALUES (${userId}, 'Booking Volunteer','volunteer@golokdham.in', ${hashedPassword},'volunteer')
    `;
        


        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
    }
}