'use server';

import { getAllRoomTypes } from './actions';
import { getAllRoomProperties } from '@/app/dashboard/admin/room_properties/actions';
import RoomTypesPage from '@/app/ui/room_types/RoomTypesPage';

export default async function Page() {
  const roomTypes = await getAllRoomTypes();
  const properties = await getAllRoomProperties();

  return (
    <RoomTypesPage
      roomTypes={roomTypes}
      properties={properties.map((p: any) => ({
        id: String(p.id),
        name: String(p.name),
      }))}
    />
  );
}
