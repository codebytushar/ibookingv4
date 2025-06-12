import { getAllSnapshots } from './data';
import SnapshotsPage from '@/app/ui/admin/snapshots/SnapshotsPage';

export default async function Page() {
  const snapshots = await getAllSnapshots();
  return <SnapshotsPage snapshots={snapshots} />;
}
