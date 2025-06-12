import { getAllShivirs } from './data';
import ShivirPage from '@/app/ui/admin/shivirs/ShivirPage'; // the client component above

export default async function Page() {
  const shivirs = await getAllShivirs();
  return <ShivirPage shivirs={shivirs} />;
}
