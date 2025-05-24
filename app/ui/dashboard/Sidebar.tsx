// app/components/Sidebar.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Shivirs', href: '/dashboard/admin/shivirs' },
    // { name: 'Satsangis', href: '/satsangis/new' },
    { name: 'Room Properties', href: '/dashboard/admin/room_properties' },
    // { name: 'Room Types', href: '/room_types/new' },
    // { name: 'Rooms', href: '/rooms/new' },
    // { name: 'Allocations', href: '/allocations/new' },
    // { name: 'Checked In', href: '/checked_in/new' },
    // { name: 'Checked Out', href: '/checked_out/new' },
    // { name: 'Import Shivirs', href: '/shivirs/import' },
    // { name: 'Import Satsangis', href: '/satsangis/import' },
    // { name: 'Import Room Properties', href: '/room_properties/import' },
    // { name: 'Import Room Types', href: '/room_types/import' },
    // { name: 'Import Rooms', href: '/rooms/import' },
    // { name: 'Import Allocations', href: '/allocations/import' },
    // { name: 'Import Checked In', href: '/checked_in/import' },
    // { name: 'Import Checked Out', href: '/checked_out/import' },
  ];

  return (
    <>
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={`bg-white/90 backdrop-blur-md w-64 p-6 fixed lg:static h-full lg:h-auto transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-800">Navigation</h2>
        </div> */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block py-2 px-4 text-gray-800 hover:bg-indigo-100/50 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}