'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function RoomAllocationPage({ rooms, satsangies }: {
  rooms: {
    id: string;
    description: string; 
    base_capacity: number;
    extra_capacity: number;
    total_allocated: number;
  }[];
  satsangies: { id: string; name: string; city: string }[];
}) {
  const [selectedSatsangi, setSelectedSatsangi] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const handleAllocate = async () => {
    if (!selectedSatsangi || !selectedRoom) {
      toast.error('Please select both satsangi and room');
      return;
    }

    const res = await fetch('/api/rooms/allocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ satsangi_id: selectedSatsangi, room_id: selectedRoom }),
    });

    if (res.ok) {
      toast.success('Allocation successful!');
      setSelectedRoom('');
      setSelectedSatsangi('');
    } else {
      toast.error('Allocation failed');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white border rounded shadow">
      <h2 className="text-xl font-semibold">Allocate Room to Satsangi</h2>

      {/* Form */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Satsangi</Label>
          <Select value={selectedSatsangi} onValueChange={setSelectedSatsangi}>
            <SelectTrigger>
              <SelectValue placeholder="Select Satsangi" />
            </SelectTrigger>
            <SelectContent>
              {satsangies.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Room</Label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Select Room (Available Only)" />
            </SelectTrigger>
            <SelectContent>
              {rooms
                .filter((r) => r.total_allocated < r.base_capacity + r.extra_capacity)
                .map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.description} — {r.total_allocated}/
                    {r.base_capacity + r.extra_capacity} occupied
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleAllocate} className="mt-4 bg-blue-600 text-white">
        Allocate
      </Button>
    </div>
  );
}
