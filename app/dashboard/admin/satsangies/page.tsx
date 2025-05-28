'use server';

import { getAllSatsangies, getAllSatsangieswithRoomNo, getAllShivirIds, getRoomsWithAllocations } from './actions';
import SatsangiesPage from '@/app/ui/satsangies/SatsangiesPage';

export default async function Page() {
  const satsangies = await getAllSatsangieswithRoomNo();
  const shivirsRaw = await getAllShivirIds();
  const shivirs = shivirsRaw.map((row: any) => ({
    id: String(row.id),
    occasion: String(row.occasion),
  }));

  return <SatsangiesPage satsangies={satsangies} shivirs={shivirs} />;
}