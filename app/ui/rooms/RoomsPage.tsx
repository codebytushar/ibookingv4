'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createRoom, deleteRoom } from '@/app/dashboard/admin/rooms/actions';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function RoomsPage({
  rooms,
  roomTypes,
}: {
  rooms: any[];
  roomTypes: { id: string; description: string }[];
}) {
  const [showForm, setShowForm] = useState(false);

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
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.room_no}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.status}</TableCell>
                  <TableCell>{getRoomDescription(room.room_type_id)}</TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        await deleteRoom(room.id);
                        toast.success("Deleted successfully");
                      }}
                    >
                      <Button type="submit" variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Page Header & Toggle Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Room'}
        </Button>
      </div>

      {/* Add Room Form */}
      {showForm && (
        <form
          action={async (formData) => {
            await createRoom(formData);
            toast.success('Room added!');
            setShowForm(false);
          }}
          className="bg-white border p-6 rounded-lg shadow space-y-6"
        >
          <h3 className="text-lg font-semibold">New Room</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="room_type_id" className="mb-1 block">Room Type</Label>
              <Select name="room_type_id" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input name="room_no" required placeholder="Room Number" />
            <Input name="floor" type="number" placeholder="Floor" />
            <Input name="status" placeholder="Status (e.g. available, booked)" />
          </div>

          <Button type="submit">Save</Button>
        </form>
      )}

      {/* Room List Table */}
  
    </div>
  );
}
