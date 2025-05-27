'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { createRoom, deleteRoom } from '@/app/dashboard/admin/rooms/actions';

export default function RoomsPage({ rooms, roomTypes }: {
  rooms: any[],
  roomTypes: { id: string; description: string }[]
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      <Toaster />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Hide Form' : 'Add Room'}
      </button>

      {showForm && (
        <form
          action={async (formData) => {
            await createRoom(formData);
            toast.success('Room added!');
            setShowForm(false);
          }}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <select name="room_type_id" required className="w-full border p-2 rounded">
            <option value="">Select Room Type</option>
            {roomTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.description}</option>
            ))}
          </select>
          <input name="room_no" placeholder="Room Number" required className="w-full border p-2 rounded" />
          <input name="floor" placeholder="Floor" type="number" className="w-full border p-2 rounded" />
          <input name="status" placeholder="Status (e.g. available, booked)" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Rooms List</h2>
        {rooms.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded shadow space-y-1">
            <p><strong>Room No:</strong> {room.room_no}</p>
            <p><strong>Floor:</strong> {room.floor}</p>
            <p><strong>Status:</strong> {room.status}</p>
            <p><strong>Room Type ID:</strong> {room.room_type_id}</p>
            <form
              action={async () => {
                await deleteRoom(room.id);
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
