// app/api/roomtypes/import/route.ts
import { NextResponse } from 'next/server';
import { createRoomType } from '@/app/dashboard/admin/room_types/actions';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    for (const entry of data) {
      const {
        description,
        base_capacity,
        extra_capacity,
        total_rooms,
        property_id,
      } = entry;

      if (!description || !base_capacity || !property_id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const formData = new FormData();
      formData.set('description', description);
      formData.set('base_capacity', String(base_capacity));
      formData.set('extra_capacity', String(extra_capacity || 0));
      formData.set('total_rooms', String(total_rooms || 0));
      formData.set('property_id', property_id);

      await createRoomType(formData);
    }

    return NextResponse.json({ message: 'Import successful' });
  } catch (error) {
    console.error('Room Type Import Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
