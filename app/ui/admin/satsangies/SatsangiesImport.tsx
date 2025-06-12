'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function SatsangiesImport({ shivirs }: { shivirs: { id: string; occasion: string }[] }) {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [selectedShivirId, setSelectedShivirId] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        console.log('Parsed CSV rows:', rows);
        const invalid = rows.some((row) => !row.name || !row.city || !row.age || !row.gender || !row.payment_id);
        if (invalid) {
          toast.error('Missing mandatory fields (name, city, age, gender, payment_id) in CSV');
          setCsvData([]);
          e.target.value = ''; // Clear the file input
          return;
        }
        setCsvData(rows);
        toast.success('CSV loaded');
      },
    });
  };

  const handleImport = async () => {
    if (!selectedShivirId) {
      toast.error('Please select a Shivir');
      return;
    }

    const enrichedData = csvData.map((row) => ({
      ...row,
      shivir_id: selectedShivirId,
    }));

    const res = await fetch('/api/satsangies/import', {
      method: 'POST',
      body: JSON.stringify(enrichedData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Imported successfully');
      setCsvData([]);
      setSelectedShivirId('');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      toast.error('Failed to import');
    }
  };

  return (
    <div className="bg-white border p-6 rounded-lg shadow space-y-4 mt-4">
     
      <Button
        className="mt-2"
        variant="outline"
        onClick={() => {
            const csv = "name,city,age,gender,payment_id\nJohn Doe,Ahmedabad,30,Male,23432\nJohn Patel,Surat,28,Male,99999";
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'satsangies-template.csv';
          link.click();
        }}
      >
        Download Template
      </Button>

      <div className="space-y-2">
        <Label>Select Shivir</Label>
        <Select onValueChange={setSelectedShivirId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose Shivir" />
          </SelectTrigger>
          <SelectContent>
            {shivirs.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.occasion}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      <div>
        <Label className="text-sm font-medium mb-1 block">Upload CSV File</Label>
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
