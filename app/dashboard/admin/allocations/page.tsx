'use server';

import { getRoomsWithAllocations } from './data'
import RoomAllocationPage from '@/app/ui/allocations/RoomAllocationPage';
import {RoomAllocation} from '@/app/datatypes/custom';
export default async function Page() {


const rooms = await getRoomsWithAllocations();
const flatRooms = rooms.flat();

  return <RoomAllocationPage rooms={flatRooms} />;
}

// Extract client part below:

