// app/api/signout/route.ts
import { signOut } from '@/auth' // your existing server-side signOut
import { NextResponse } from 'next/server'

export async function POST() {
  await signOut() // your server-side logic

  return NextResponse.json({ success: true }) // or redirect if preferred
}
