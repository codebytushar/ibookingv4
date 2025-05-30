'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createRoomType, deleteRoomType } from '@/app/dashboard/admin/room_types/actions';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import RoomTypesImport from './RoomTypesImport';


export default function RoomTypesPage({
  roomTypes,
  properties,
}: {
  roomTypes: any[];
  properties: { id: string; name: string }[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const getPropertyName = (propertyId: string): string => {
    const property = properties.find((p) => p.id === propertyId);
    return property ? property.name : propertyId;
  };

  return (
    <div className="space-y-10">
      <Toaster />
      <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Room Types List</h3>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white">Description</TableHead>
                <TableHead className="text-white">Base</TableHead>
                <TableHead className="text-white">Extra</TableHead>
                <TableHead className="text-white">Total</TableHead>
                <TableHead className="text-white">Property</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.base_capacity}</TableCell>
                  <TableCell>{r.extra_capacity}</TableCell>
                  <TableCell>{r.total_rooms}</TableCell>
                  <TableCell>{getPropertyName(r.property_id)}</TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        try {
                          await deleteRoomType(r.id);
                          toast.success("Deleted successfully");
                        } catch (error) {
                          toast.error("Failed to delete : " + (error instanceof Error ? `: ${error.message}` : ''));
                        }
                      }}
                    >
                      <Button variant="destructive" size="sm" type="submit">
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
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Room Type'}
        </Button>
         <Button variant="secondary" onClick={() => setShowImport(!showImport)}>
        {showImport ? 'Hide Import' : 'Import CSV'}
      </Button>
      </div>

      {showForm && (
        <form
          action={async (formData) => {
            await createRoomType(formData);
            setShowForm(false);
            toast.success('Room Type added!');
          }}
          className="bg-white border p-6 rounded-lg shadow space-y-6"
        >
          <h3 className="text-lg font-semibold">New Room Type</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Textarea name="description" placeholder="Description" required />
            <Input name="base_capacity" type="number" placeholder="Base Capacity" required />
            <Input name="extra_capacity" type="number" placeholder="Extra Capacity" />

            <div>
              <Label htmlFor="property_id" className="mb-1 block">Property</Label>
              <Select name="property_id" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input name="total_rooms" type="number" placeholder="Total Rooms" required />
          </div>

          <Button type="submit">Save</Button>
        </form>
      )}

     

      {showImport && (
        <div className="mt-4">
          <RoomTypesImport properties={properties}/>
        </div>
      )}



    </div>
  );
}
