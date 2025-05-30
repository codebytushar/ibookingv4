'use client';

import { useState } from 'react';
import { createRoomProperty, deleteRoomProperty } from '@/app/dashboard/admin/room_properties/actions';
import toast, { Toaster } from 'react-hot-toast';
import { QueryResultRow } from '@vercel/postgres';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function RoomPropertiesPage({
  properties,
  shivirs,
}: {
  properties: QueryResultRow[];
  shivirs: { id: string; occasion: string }[];
}) {
  const [showForm, setShowForm] = useState(false);

  // Function to get shivir occasion from id
const getShivirOccasion = (shivirId: string): string => {
  const shivir = shivirs.find(s => s.id === shivirId);
  return shivir ? shivir.occasion : 'Unknown';
}  

  return (
    <div className="space-y-10">
      <Toaster />
  <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Room Properties List</h3>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">City / State</TableHead>
                <TableHead className="text-white">PIN</TableHead>
                <TableHead className="text-white">Shivir</TableHead>
                <TableHead className="text-white">Map Link</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.city}, {p.state}</TableCell>
                  <TableCell>{p.pin}</TableCell>
                  <TableCell>{getShivirOccasion(p.shivir_id)}</TableCell>
                  <TableCell>
                    {p.map_link ? (
                      <a
                        href={p.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Map
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        try {
                          await deleteRoomProperty(p.id);
                          toast.success("Deleted successfully");
                        } catch (error) {
                          toast.error("Failed to delete property" + (error instanceof Error ? `: ${error.message}` : ''));
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
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Room Property'}
        </Button>
      </div>

      {showForm && (
        <form
          action={async (formData) => {
            await createRoomProperty(formData);
            setShowForm(false);
            toast.success('Property added!');
          }}
          className="bg-white border p-6 rounded-lg shadow space-y-6"
        >
          <h3 className="text-lg font-semibold">New Room Property</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shivir_id" className="mb-1 block">Shivir</Label>
              <Select name="shivir_id">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Shivir" />
                </SelectTrigger>
                <SelectContent>
                  {shivirs.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.occasion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input name="name" placeholder="Name" required />
            <Input name="address" placeholder="Address" required />
            <Input name="map_link" placeholder="Map Link" />
            <Input name="city" placeholder="City" required />
            <Input name="state" placeholder="State" required />
            <Input name="pin" placeholder="PIN Code" required />
          </div>

          <Button type="submit">Save</Button>
        </form>
      )}

    
    </div>
  );
}
