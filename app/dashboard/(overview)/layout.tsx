// app/(protected)/layout.tsx
'use client';

import Header from '@/app/ui/dashboard/Header';
import Sidebar from '@/app/ui/dashboard/Sidebar';
import Footer from '@/app/ui/dashboard/Footer';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col">
        <Header />
        <div className="flex flex-1">
          {/* <Sidebar /> */}
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
  );
}