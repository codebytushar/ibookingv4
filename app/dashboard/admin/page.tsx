// app/(protected)/dashboard/page.tsx
'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-800">
            Welcome, 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your User ID: <span className="font-semibold"></span>
          </p>
          <p className="text-gray-600 mt-2">
            This is your dashboard for managing room bookings and satsangi activities. Use the sidebar to navigate to Rooms, Satsangis, or Shivir Planning.
          </p>
        </CardContent>
      </Card>

      {/* Placeholder for future content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-indigo-100/80 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-800">Room Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Manage room properties and occupancy.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-indigo-100/80 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-800">Satsangi Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Track seva and preferences.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white to-indigo-100/80 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-indigo-800">Shivir Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Organize events with control.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}