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
};