'use server';

import { getRoomsWithAllocations, getSatsangies } from './data'
import RoomAllocationPage from '@/app/ui/allocations/RoomAllocationPage';

export default async function Page() {

type Room = {
  id: string;
  description: string;
  room_no: string;
  floor: number;
  base_capacity: number;
  extra_capacity: number;
  total_allocated: number;
};

const rawRooms = await getRoomsWithAllocations();

const rooms = rawRooms.map((room) => ({
  id: String(room.id),
  description: String(room.description),
  base_capacity: Number(room.base_capacity),
  extra_capacity: Number(room.extra_capacity),
  total_allocated: Number(room.total_allocated),
  room_no: String(room.room_no),
  floor: Number(room.floor),
}));

  return <RoomAllocationPage rooms={rooms} />;
}

// Extract client part below:

