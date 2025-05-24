'use server';

import { getAllRoomProperties, getAllShivirIds } from './data';
import RoomPropertiesPage from '@/app/ui/room_properties/RoomPropertiesPage'; // Adjust the import path as necessary

export default async function Page() {
  const properties = await getAllRoomProperties();
  const shivirsRaw = await getAllShivirIds();
  const shivirs = shivirsRaw.map((row: any) => ({
    id: row.id,
    occasion: row.occasion,
  }));

  return <RoomPropertiesPage properties={properties} shivirs={shivirs}/>;
}

// Extract client part below:

