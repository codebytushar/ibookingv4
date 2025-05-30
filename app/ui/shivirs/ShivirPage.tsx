'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createShivir, deleteShivir } from '@/app/dashboard/admin/shivirs/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';

export default function ShivirPage({ shivirs }: { shivirs: any[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    try {
      await deleteShivir(id);
      toast.success('Shivir deleted!');
    } catch (error) {
      toast.error('Failed to delete shivir.' + (error instanceof Error ? `: ${error.message}` : ''));
    }
  }

  return (
    <div className=" space-y-10">
      <Toaster />

      {/* Table Section */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Shivir List</h3>
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow>
                <TableHead className="text-white">Occasion</TableHead>
                <TableHead className="text-white">City</TableHead>
                <TableHead className="text-white">Address</TableHead>
                <TableHead className="text-white">Start</TableHead>
                <TableHead className="text-white">End</TableHead>
                <TableHead className="text-white">Map</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shivirs.map((shivir) => (
                <TableRow key={shivir.id}>
                  <TableCell>{shivir.occasion}</TableCell>
                  <TableCell>{shivir.city}</TableCell>
                  <TableCell>{shivir.address}</TableCell>
                  <TableCell>{new Date(shivir.start_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(shivir.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {shivir.map_link ? (
                      <a
                        href={shivir.map_link}
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
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(shivir.id)}
                      className="text-sm"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Toggle Form Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Shivir'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          action={async (formData) => {
            await createShivir(formData);
            setShowForm(false);
            toast.success('Shivir added successfully!');
          }}
          className="bg-white border p-6 rounded-lg shadow space-y-6"
        >
          <h3 className="text-lg font-semibold">Add New Shivir</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="occasion" required placeholder="Occasion" />
            <Input name="start_date" type="date" required />
            <Input name="end_date" type="date" required />
            <Input name="city" required placeholder="City" />
            <Input name="address" placeholder="Address" />
            <Input name="map_link" placeholder="Map Link" />
          </div>
          <Button type="submit" className="mt-2">Add Shivir</Button>
        </form>
      )}

    </div>
  );
}
