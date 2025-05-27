'use server';

import { getRoomsWithAllocations, getSatsangies } from './data'
import RoomAllocationPage from '@/app/ui/allocations/RoomAllocationPage';

export default async function Page() {

const satsangiesRaw = await getSatsangies();

const satsangies = satsangiesRaw.map((s: any) => ({
  id: String(s.id),
  name: String(s.name),
  city: String(s.city),
}));

const rawRooms = await getRoomsWithAllocations();

const rooms = rawRooms.map((room: any) => ({
  id: String(room.id),
  description: String(room.description),
  base_capacity: Number(room.base_capacity),
  extra_capacity: Number(room.extra_capacity),
  total_allocated: Number(room.total_allocated),
}));

  return <RoomAllocationPage rooms={rooms} satsangies={satsangies}/>;
}

// Extract client part below:

