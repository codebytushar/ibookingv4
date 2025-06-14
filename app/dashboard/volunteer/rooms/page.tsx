'use server';

import { getAllRooms, getAllRoomTypeOptions } from './data';
import RoomsPage from '@/app/ui/volunteer/rooms/RoomsPage';

export default async function Page() {
  const roomsRaw = await getAllRooms();
  const rooms = roomsRaw.map((room: any) => ({
    id: String(room.id),
    room_no: String(room.room_no),
    floor: Number(room.floor),
    status: String(room.status),
    room_type_id: String(room.room_type_id),
  }));
  const roomTypesRaw = await getAllRoomTypeOptions();
  const roomTypes = roomTypesRaw.map((rt: any) => ({
    id: String(rt.id),
    description: String(rt.description),
  }));

  return <RoomsPage rooms={rooms} roomTypes={roomTypes} />;
}
