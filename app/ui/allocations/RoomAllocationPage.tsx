'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RoomAllocation } from '@/app/datatypes/custom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AllocationsPage({ rooms }: { rooms: RoomAllocation[] }) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  return (
    <div className="space-y-2 p-6 bg-gray-100 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {rooms.map((room) => {
          const maxCapacity = room.base_capacity + room.extra_capacity;
          const isFull = room.total_allocated >= maxCapacity;
          const Available = maxCapacity - room.total_allocated;

          return (
            <div
              key={room.id}
              className={`border rounded-xl p-4 shadow flex flex-col justify-between space-y-4 ${Available === 0
                ? 'bg-red-200'
                : Available === 1
                  ? 'bg-red-100'
                  : Available === 2
                    ? 'bg-yellow-200'
                    : Available === 3
                      ? 'bg-yellow-100'
                      : 'bg-green-200'
                }`}
            >
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-lg font-semibold cursor-help">
                        Room #{room.room_no} ({room.total_allocated}/{maxCapacity})
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{room.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div>

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
