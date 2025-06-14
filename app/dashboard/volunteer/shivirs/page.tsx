import { getAllShivirs } from './data';
import ShivirPage from '@/app/ui/volunteer/shivirs/ShivirPage'; // the client component above

export default async function Page() {
  const shivirs = await getAllShivirs();
  return <ShivirPage shivirs={shivirs} />;
}
