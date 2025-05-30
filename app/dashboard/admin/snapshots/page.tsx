import { getAllSnapshots } from './actions';
import SnapshotsPage from '@/app/ui/snapshots/SnapshotsPage';

export default async function Page() {
  const snapshots = await getAllSnapshots();
  return <SnapshotsPage snapshots={snapshots} />;
}
