// app/components/Header.tsx
'use client';

import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, PowerIcon } from 'lucide-react';
import SignOutButton from './SignOut';

export default function Header() {

  return (
    <header className="bg-indigo-600/90 backdrop-blur-md text-white py-4 px-6 flex justify-between items-center shadow-lg">
      <Link href="/" className="flex items-center space-x-2">
        {/* <img src="/images/logo.png" alt="Golokdham IBooking" className="h-8 w-auto" /> */}
        <span className="text-xl font-semibold">Golokdham IBooking</span>
      </Link>
      <div className="flex items-center space-x-4">
        {/* <Link href="/dashboard" className="text-white hover:text-indigo-200">
          Dashboard
        </Link>
         */}
       <SignOutButton />
      </div>
    </header>
  );
}