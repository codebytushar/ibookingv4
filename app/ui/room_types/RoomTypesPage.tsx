'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createRoomType, deleteRoomType } from '@/app/dashboard/admin/room_types/actions';

export default function RoomTypesPage({ roomTypes, properties }: {
  roomTypes: any[],
  properties: { id: string; name: string }[]
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <Toaster />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Add Room Type'}
      </button>

      {showForm && (
        <form
          action={async (formData) => {
            await createRoomType(formData);
            setShowForm(false);
            toast.success('Room Type added!');
          }}
          className="bg-white p-6 shadow rounded space-y-4"
        >
          <textarea name="description" placeholder="Description" required className="w-full border p-2 rounded" />
          <input name="base_capacity" type="number" placeholder="Base Capacity" required className="w-full border p-2 rounded" />
          <input name="extra_capacity" type="number" placeholder="Extra Capacity" className="w-full border p-2 rounded" />
          <select name="property_id" required className="w-full border p-2 rounded">
            <option value="">Select Property</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input name="total_rooms" type="number" placeholder="Total Rooms" required className="w-full border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      <h2 className="text-xl font-semibold">Room Types</h2>
      {roomTypes.map((r) => (
        <div key={r.id} className="bg-white shadow p-4 rounded space-y-1">
          <p><strong>Description:</strong> {r.description}</p>
          <p><strong>Base:</strong> {r.base_capacity}, <strong>Extra:</strong> {r.extra_capacity}</p>
          <p><strong>Total Rooms:</strong> {r.total_rooms}</p>
          <p><strong>Property:</strong> {r.property_id}</p>
          <form
            action={async () => {
              await deleteRoomType(r.id);
              toast.success('Deleted successfully');
            }}
          >
            <button type="submit" className="text-red-600 text-sm mt-2">Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
}
