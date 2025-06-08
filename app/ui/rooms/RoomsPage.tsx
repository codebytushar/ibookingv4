'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createRoom, deleteRoom, updateRoom } from '@/app/dashboard/admin/rooms/actions';
import RoomsImport from './RoomsImport';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RoomsPage({
  rooms,
  roomTypes,
}: {
  rooms: { id: string; room_no: string; floor: number; status: string; room_type_id: string }[];
  roomTypes: { id: string; description: string }[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ id: string; room_no: string; floor: number; status: string; room_type_id: string } | null>(null);

  const getRoomDescription = (roomTypeId: string): string => {
    const roomType = roomTypes.find((type) => type.id === roomTypeId);
    return roomType?.description || 'Unknown';
  };

  const handleEditClick = (room: { id: string; room_no: string; floor: number; status: string; room_type_id: string }) => {
    setEditingRoom(room);
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
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(room)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <form
                        action={async () => {
                          try {
                            const confirmed = window.confirm(`Are you sure you want to delete room ${room.room_no}?`);
                            if (!confirmed) return;
                            await deleteRoom(room.id);
                            toast.success("Deleted successfully");
                          } catch (error) {
                            toast.error("Failed to delete room: " + (error instanceof Error ? error.message : 'Unknown error'));
                          }
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Room'}
        </Button>
        <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
          {showImport ? 'Hide Import' : 'Import Rooms'}
        </Button>
      </div>

      {showForm && (
        <form
          action={async (formData) => {
            try {
              await createRoom(formData);
            } catch (error) {
              toast.error('Failed to add room: ' + (error instanceof Error ? error.message : 'Unknown error'));
              return;
            }
            toast.success('Room added!');
            setShowForm(false);
          }}
          className="bg-white border p-6 rounded-lg shadow space-y-6"
        >
          <h3 className="text-lg font-semibold">New Room</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              {/* <Label htmlFor="room_type_id" className="mb-1 block">Room Type</Label> */}
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

      {showImport && (
        <div className="mt-4">
          <RoomsImport roomTypes={roomTypes} />
        </div>
      )}

      <Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Room: {editingRoom?.room_no}</DialogTitle>
          </DialogHeader>
          {editingRoom && (
            <form
              action={async (formData) => {
                try {
                  await updateRoom(editingRoom.id, formData);
                  toast.success("Room updated successfully!");
                  setEditingRoom(null);
                } catch (error) {
                  toast.error("Failed to update room");
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="room_type_id">Room Type</Label>
                  <Select name="room_type_id" defaultValue={editingRoom.room_type_id} required>
                    <SelectTrigger>
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
                <div>
                  <Label htmlFor="room_no">Room Number</Label>
                  <Input
                    name="room_no"
                    defaultValue={editingRoom.room_no}
                    disabled
                    placeholder="Room Number (cannot be changed)"
                  />
                </div>
                <div>
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    name="floor"
                    type="number"
                    defaultValue={editingRoom.floor}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Input
                    name="status"
                    defaultValue={editingRoom.status}
                    placeholder="e.g. available, booked"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRoom(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}