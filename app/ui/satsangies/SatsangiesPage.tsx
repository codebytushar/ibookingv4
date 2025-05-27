'use client';

import { useState } from 'react';
import { createSatsangi, deleteSatsangi } from '@/app/dashboard/admin/satsangies/actions';
import toast, { Toaster } from 'react-hot-toast';
import SatsangiesImport from './SatsangiesImport';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SatsangiesPage({
  satsangies,
  shivirs,
}: {
  satsangies: any[];
  shivirs: { id: string; occasion: string }[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  function getShivirOccasion(shivirId: string): string {
    return shivirs.find(shivir => shivir.id === shivirId)?.occasion || '';
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <Toaster />

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Add Satsangi'}
      </button>

      {showForm && (
        <form
          action={async (formData) => {
            await createSatsangi(formData);
            toast.success('Satsangi added!');
            setShowForm(false);
          }}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <input name="name" required placeholder="Name" className="w-full border p-2 rounded" />
          <input name="age" type="number" placeholder="Age" className="w-full border p-2 rounded" />
          <input name="city" required placeholder="City" className="w-full border p-2 rounded" />
          <input name="state" placeholder="State" className="w-full border p-2 rounded" />
          <input name="birthdate" type="date" className="w-full border p-2 rounded" />
          <input name="panno" placeholder="PAN No." className="w-full border p-2 rounded" />
          <input name="address" placeholder="Address" className="w-full border p-2 rounded" />
          <input name="mobile" placeholder="Mobile" className="w-full border p-2 rounded" />
          <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" />
          <select name="gender" className="w-full border p-2 rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <select name="shivir_id" className="w-full border p-2 rounded">
            <option value="">Select Shivir</option>
            {shivirs.map((s) => (
              <option key={s.id} value={s.id}>{s.occasion}</option>
            ))}
          </select>
          <input name="payment_id" type="number" placeholder="Payment ID" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      <div className="flex gap-4">
       

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowImport(!showImport)}
        >
          {showImport ? 'Hide Import' : 'Import CSV'}
        </button>
      </div>

      {showImport && <SatsangiesImport />}

      <h2 className="text-xl font-semibold mb-4">Satsangi List</h2>

      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">City</TableHead>
            <TableHead className="text-white">Gender</TableHead>
            <TableHead className="text-white">Shivir</TableHead>
            <TableHead className="text-white">Payment ID</TableHead>
            <TableHead className="text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {satsangies.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.city}</TableCell>
              <TableCell>{s.gender}</TableCell>
              <TableCell>{getShivirOccasion(s.shivir_id)}</TableCell>
              <TableCell>{s.payment_id}</TableCell>
              <TableCell>
                <form
                  action={async () => {
                    await deleteSatsangi(s.id);
                    toast.success("Deleted successfully");
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </div>
  );
}
