// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/auth'; // Adjust this path if needed

const handler = NextAuth(authOptions);

// ✅ Export handlers for GET and POST (App Router expects this)
export const GET = handler;
export const POST = handler;
