'use server';

import { getAllRoomTypes } from './data';
import { getAllRoomProperties } from '@/app/dashboard/admin/room_properties/data';
import RoomTypesPage from '@/app/ui/admin/room_types/RoomTypesPage';

export default async function Page() {
  const roomTypes = await getAllRoomTypes();
  const properties = await getAllRoomProperties();

  return (
    <RoomTypesPage
      roomTypes={roomTypes.map((rt: any) => ({
        id: String(rt.id),
        description: String(rt.description),
        base_capacity: Number(rt.base_capacity),
        extra_capacity: Number(rt.extra_capacity),
        total_rooms: Number(rt.total_rooms),
        property_id: String(rt.property_id),
      }))}
      properties={properties.map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
      }))}
    />
  );
}
