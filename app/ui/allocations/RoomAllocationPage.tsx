'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";

type Room = {
  id: string;
  description: string;
  room_no: string;
  floor: number;
  base_capacity: number;
  extra_capacity: number;
  total_allocated: number;
};

export default function AllocationsPage({ rooms }: { rooms: Room[] }) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="space-y-2 p-6 bg-gray-100 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => {
          const maxCapacity = room.base_capacity + room.extra_capacity;
          const isFull = room.total_allocated >= maxCapacity;

          return (
            <div key={room.id} className="border rounded-xl p-4 shadow bg-white flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{room.description}</h3>
                <p className="text-sm text-gray-600">Room #{room.room_no} — Floor {room.floor}</p>
              </div>

              <div>
                <p className="text-sm">
                  <strong>Capacity:</strong> {room.total_allocated}/{maxCapacity}
                </p>
                <p className={`text-sm font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                  {isFull ? 'Full' : 'Available'}
                </p>
              </div>

              <div>
                <Button
                  variant="outline"
                  disabled={isFull}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  {isFull ? 'Room Full' : 'Assign Satsangi'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedRoom && (
        <div className="mt-8 p-4 bg-gray-50 rounded border">
          {/* Your allocation form component or logic here */}
          <p className="font-medium">Assigning satsangi to Room ID: {selectedRoom}</p>
          {/* Include a satsangi dropdown + assign button here */}
        </div>
      )}
    </div>
  );
}
