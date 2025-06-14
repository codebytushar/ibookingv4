'use client';

import  { Toaster } from 'react-hot-toast';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";


export default function RoomTypesPage({
  roomTypes,
  properties,
}: {
  roomTypes: { id: string; description: string; base_capacity: number; extra_capacity: number; total_rooms: number; property_id: string }[];
  properties: { id: string; name: string }[];
}) {
 
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
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
    </div>
  );
}