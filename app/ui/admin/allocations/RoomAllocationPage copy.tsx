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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AllocationsPage({ rooms }: { rooms: RoomAllocation[] }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomAllocation | null>(null);

  const handleRoomSelect = (room: RoomAllocation) => {
    setSelectedRoom(room);
  };

  const handleCloseDialog = () => {
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-2 p-6 bg-gray-100 rounded-lg shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {rooms.map((room) => {
          const maxCapacity = room.base_capacity + room.extra_capacity;
          const isFull = room.total_allocated >= maxCapacity;
          const available = maxCapacity - room.total_allocated;

          return (
            <div
              key={room.id}
              className={`border rounded-xl p-4 shadow flex flex-col justify-between space-y-4 ${
                available === 0
                  ? 'bg-red-200'
                  : available === 1
                    ? 'bg-red-100'
                    : available === 2
                      ? 'bg-yellow-200'
                      : available === 3
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
                  onClick={() => handleRoomSelect(room)}
                >
                  {isFull ? 'Room Full' : 'Assign Satsangi'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedRoom} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Satsangi to Room #{selectedRoom?.room_no}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Placeholder for your form content */}
            <p>Room Capacity: {selectedRoom?.total_allocated}/{selectedRoom ? selectedRoom.base_capacity + selectedRoom.extra_capacity : 0}</p>
            
            {/* You can add your satsangi selection dropdown here */}
            {/* Example: */}
            {/* <SatsangiDropdown roomId={selectedRoom?.id} /> */}
            
            {/* And an assign button */}
            {/* <Button onClick={handleAssign}>Assign</Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}