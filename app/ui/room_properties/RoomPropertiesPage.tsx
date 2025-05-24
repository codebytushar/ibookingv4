'use client';

import { useState } from 'react';
import { createRoomProperty, deleteRoomProperty } from '@/app/dashboard/admin/room_properties/actions'; // Adjust the import path as necessary
import toast, { Toaster } from 'react-hot-toast';
import { QueryResultRow } from '@vercel/postgres';

export default function RoomPropertiesPage({ properties, shivirs }: { properties: QueryResultRow[],  shivirs: { id: number; occasion: string }[]; }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <Toaster />

      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Add Room Property'}
      </button>

      {showForm && (
        <form
          action={async (formData) => {
            await createRoomProperty(formData);
            setShowForm(false);
            toast.success('Property added!');
          }}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <h2 className="text-lg font-bold">New Room Property</h2>
          <select name="shivir_id" required className="w-full border p-2 rounded">
  <option value="">Select Shivir</option>
  {shivirs.map((s) => (
    <option key={s.id} value={s.id}>
      {s.occasion}
    </option>
  ))}
</select>
          <input name="name" placeholder="Name" required className="w-full border p-2 rounded" />
          <input name="address" placeholder="Address" required className="w-full border p-2 rounded" />
          <input name="map_link" placeholder="Map Link" className="w-full border p-2 rounded" />
          <input name="city" placeholder="City" required className="w-full border p-2 rounded" />
          <input name="state" placeholder="State" required className="w-full border p-2 rounded" />
          <input name="pin" placeholder="PIN Code" required className="w-full border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Room Properties</h2>
        {properties.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded shadow space-y-2">
            <h3 className="text-lg font-bold">{p.name}</h3>
            <p>{p.city}, {p.state} - {p.pin}</p>
            <p className="text-sm text-gray-500">Shivir ID: {p.shivir_id}</p>
            {p.map_link && (
              <a href={p.map_link} className="text-blue-600 text-sm underline" target="_blank">View Map</a>
            )}
            <form
              action={async () => {
                await deleteRoomProperty(p.id);
                toast.success('Deleted successfully');
              }}
            >
              <button type="submit" className="text-red-600 text-sm mt-2">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}