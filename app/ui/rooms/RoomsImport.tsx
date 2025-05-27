'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export default function RoomsImport({ roomTypes }: { roomTypes: { id: string; description: string }[] }) {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        const invalid = rows.some((row) => !row.room_no || !row.floor || !row.status);
        if (invalid) {
          toast.error('Missing required fields (room_no, floor, status)');
          return;
        }
        setCsvData(rows);
        toast.success('CSV loaded');
      },
    });
  };

  const handleImport = async () => {
    if (!selectedRoomTypeId) {
      toast.error('Please select a Room Type');
      return;
    }

    const enrichedData = csvData.map((row) => ({
      ...row,
      room_type_id: selectedRoomTypeId,
    }));

    const res = await fetch('/api/rooms/import', {
      method: 'POST',
      body: JSON.stringify(enrichedData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Rooms imported successfully');
      setCsvData([]);
    } else {
      toast.error('Import failed');
    }
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Select Room Type</Label>
        <Select onValueChange={setSelectedRoomTypeId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose Room Type" />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.description}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Upload CSV File</Label>
        <Input type="file" accept=".csv" onChange={handleFileChange} className="w-full" />
      </div>

      {csvData.length > 0 && (
        <>
          <div className="overflow-auto max-h-64 border rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-800 text-white">
                <tr>
                  {Object.keys(csvData[0]).map((key) => (
                    <th key={key} className="px-4 py-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-2">{String(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={handleImport} className="bg-green-600 text-white">
            Import
          </Button>
        </>
      )}
    </div>
  );
}
