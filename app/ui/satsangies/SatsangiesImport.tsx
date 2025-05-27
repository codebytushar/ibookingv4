'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

export default function SatsangiesImport() {
  const [csvData, setCsvData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as any[];
        const invalid = rows.some((row) => !row.name || !row.city);
        if (invalid) {
          toast.error('Missing mandatory fields (name, city)');
          return;
        }
        setCsvData(rows);
        toast.success('CSV loaded');
      },
    });
  };

  const handleImport = async () => {
    const res = await fetch('/api/satsangies/import', {
      method: 'POST',
      body: JSON.stringify(csvData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      toast.success('Imported successfully');
      setCsvData([]);
    } else {
      toast.error('Failed to import');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4 mt-4">
      <input type="file" accept=".csv" onChange={handleFileChange} />
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
          <button onClick={handleImport} className="bg-green-600 text-white px-4 py-2 rounded">
            Import
          </button>
        </>
      )}
    </div>
  );
}
