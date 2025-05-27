'use client';

import { useState } from 'react';
import { createSatsangi, deleteSatsangi } from '@/app/dashboard/admin/satsangies/actions';
import toast, { Toaster } from 'react-hot-toast';

export default function SatsangiesPage({ satsangies }: { satsangies: any[] }) {
  const [showForm, setShowForm] = useState(false);

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
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      )}

      <h2 className="text-xl font-semibold">Satsangi List</h2>
      <div className="space-y-4">
        {satsangies.map((s) => (
          <div key={s.id} className="bg-white p-4 rounded shadow">
            <p><strong>Name:</strong> {s.name}</p>
            <p><strong>City:</strong> {s.city}</p>
            <p><strong>Gender:</strong> {s.gender}</p>
            <p><strong>Mobile:</strong> {s.mobile}</p>
            <form
              action={async () => {
                await deleteSatsangi(s.id);
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
