'use client';

import  { Toaster } from 'react-hot-toast';
import { QueryResultRow } from '@vercel/postgres';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';


export default function RoomPropertiesPage({
  properties,
  shivirs,
}: {
  properties: QueryResultRow[];
  shivirs: { id: string; occasion: string }[];
}) {

  const getShivirOccasion = (shivirId: string): string => {
    const shivir = shivirs.find(s => s.id === shivirId);
    return shivir ? shivir.occasion : 'Unknown';
  };

  

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
                 
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
     

     
    </div>
  );
}