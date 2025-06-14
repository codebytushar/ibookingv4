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
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
     

    </div>
  );
}
