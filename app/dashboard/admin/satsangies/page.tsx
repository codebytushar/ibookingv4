'use server';

import { getAllSatsangies, getAllShivirIds } from './actions';
import SatsangiesPage from '@/app/ui/satsangies/SatsangiesPage';

export default async function Page() {
  const satsangies = await getAllSatsangies();
  const shivirsRaw = await getAllShivirIds();
  const shivirs = shivirsRaw.map((row: any) => ({
    id: String(row.id),
    occasion: String(row.occasion),
  }));

  return <SatsangiesPage satsangies={satsangies} shivirs={shivirs} />;
}
