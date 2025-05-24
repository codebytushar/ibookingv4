'use client';

import { useState } from 'react';
import { createShivir, deleteShivir } from '@/app/dashboard/admin/shivirs/actions'; // Adjust the import path as necessary
import toast, { Toaster } from 'react-hot-toast';

export default function ShivirPage({ shivirs }: { shivirs: any[] }) {
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    const result = await deleteShivir(id); // Must call via `use server action workaround`, or make delete a POST form
    toast.success('Shivir deleted!');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <Toaster />

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {showForm ? 'Hide Form' : 'Add Shivir'}
      </button>

      {showForm && (
        <form
          action={async (formData) => {
            await createShivir(formData);
            setShowForm(false);
            toast.success('Shivir added successfully!');
          }}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <h2 className="text-xl font-semibold">Add New Shivir</h2>
          <input name="occasion" placeholder="Occasion" required className="w-full border p-2 rounded" />
          <input name="start_date" type="date" required className="w-full border p-2 rounded" />
          <input name="end_date" type="date" required className="w-full border p-2 rounded" />
          <input name="city" placeholder="City" required className="w-full border p-2 rounded" />
          <input name="address" placeholder="Address" className="w-full border p-2 rounded" />
          <input name="map_link" placeholder="Map Link" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Add Shivir</button>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Shivir List</h2>
        {shivirs.map((shivir) => (
          <div key={shivir.id} className="border rounded p-4 bg-white shadow">
            <h3 className="text-lg font-bold">{shivir.occasion}</h3>
            <p className="text-gray-700">{shivir.city} — {shivir.address}</p>
            <p className="text-sm text-gray-500">
              {new Date(shivir.start_date).toLocaleDateString()} → {new Date(shivir.end_date).toLocaleDateString()}
            </p>
            {shivir.map_link && (
              <a href={shivir.map_link} target="_blank" className="text-blue-600 underline text-sm">
                View Map
              </a>
            )}
            <button
              onClick={() => handleDelete(shivir.id)}
              className="mt-2 text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
