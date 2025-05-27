'use server';

import { getAllSatsangies } from './actions';
import SatsangiesPage from '@/app/ui/satsangies/SatsangiesPage';

export default async function Page() {
  const satsangies = await getAllSatsangies();
  return <SatsangiesPage satsangies={satsangies} />;
}
