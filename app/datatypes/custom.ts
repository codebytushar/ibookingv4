import { Satsangi } from "./schema";

export type RoomAllocation = {
  id: string;
  room_type_id: string;
  room_no: string;
  floor: number;
  status: string;
  base_capacity: number;
  extra_capacity: number;
  total_allocated: number;
  description: string; // Room type description
  checked_in_count?: number; // Optional, if you want to track checked-in count
};

// Make sure to import or define Satsangi above this interface
export interface SatsangiWithRoom extends Satsangi {
  room_no: string | null; // Room number if allocated
}
