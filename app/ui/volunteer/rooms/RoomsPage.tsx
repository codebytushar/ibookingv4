'use client';

import { Toaster } from 'react-hot-toast';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";


export default function RoomsPage({
  rooms,
  roomTypes,
}: {
  rooms: { id: string; room_no: string; floor: number; status: string; room_type_id: string }[];
  roomTypes: { id: string; description: string }[];
}) {
 

  const getRoomDescription = (roomTypeId: string): string => {
    const roomType = roomTypes.find((type) => type.id === roomTypeId);
    return roomType?.description || 'Unknown';
  };




  return (
    <div className="space-y-10">
      <Toaster />
      <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Room List</h3>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white">Room No</TableHead>
                <TableHead className="text-white">Floor</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Room Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.room_no}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.status}</TableCell>
                  <TableCell>{getRoomDescription(room.room_type_id)}</TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
    </div>
  );
}