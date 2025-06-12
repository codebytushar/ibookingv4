'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SignOutButton from './SignOut';
import { getDashboardStats } from '@/app/dashboard/volunteer/actions';
import {
  Building,
  Users,
  ClipboardList,
  LogIn,
  DoorOpen,
  DoorClosed,
  HelpCircle,
  XOctagon
} from 'lucide-react';

export default function Header() {
  const [stats, setStats] = useState({
    totalCapacity: 0,
    registered: 0,
    allocated: 0,
    checkedIn: 0,
    unregistered: 0,
    actualAvailable: 0,
    unallocatedSatsangies: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const data = await getDashboardStats();
      if (data) {
        setStats({
          totalCapacity: data.totalCapacity ?? 0,
          registered: data.registered ?? 0,
          allocated: data.allocated ?? 0,
          checkedIn: data.checkedIn ?? 0,
          unregistered: data.unregistered ?? 0,
          actualAvailable: data.actualAvailable ?? 0,
          unallocatedSatsangies: data.unallocatedSatsangies ?? 0
        });
      }
    }
    fetchStats();
  }, []);


  const iconStats = [
    { label: 'Total Capacity', value: stats.totalCapacity, icon: Building },
    { label: 'Registered', value: stats.registered, icon: Users },
    { label: 'Allocated', value: stats.allocated, icon: ClipboardList },
    { label: 'Unallocated', value: stats.unallocatedSatsangies, icon: XOctagon },
    { label: 'Checked In', value: stats.checkedIn, icon: LogIn },
    { label: 'Available', value: stats.totalCapacity - stats.allocated, icon: DoorOpen },
    { label: 'Actual Available', value: stats.actualAvailable, icon: DoorClosed },
    { label: 'Unregistered', value: stats.unregistered, icon: HelpCircle }
  ];

  return (
    <header className="bg-indigo-600/90 backdrop-blur-md text-white py-4 px-6 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Title */}
        <Link href="/dashboard/admin" className="flex items-center space-x-2">
          <span className="text-xl font-semibold">Golokdham IBooking</span>
        </Link>

        {/* Stats */}
        <div className="hidden md:flex gap-6 px-6">
          {iconStats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon
                className={`w-5 h-5 ${label === 'Unregistered' ? 'text-red-400' : 'text-white'
                  }`}
              />
              <div className="flex flex-col text-xs leading-tight">
                <span className="font-medium">{value}</span>
                <span className="text-white/80">{label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sign Out */}
        <div className="flex items-center space-x-4">
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
