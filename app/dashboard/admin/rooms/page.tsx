'use server';

import { getAllRooms, getAllRoomTypeOptions } from './actions';
import RoomsPage from '@/app/ui/rooms/RoomsPage';

export default async function Page() {
  const rooms = await getAllRooms();
  const roomTypesRaw = await getAllRoomTypeOptions();
  const roomTypes = roomTypesRaw.map((rt: any) => ({
    id: String(rt.id),
    description: String(rt.description),
  }));

  return <RoomsPage rooms={rooms} roomTypes={roomTypes} />;
}
