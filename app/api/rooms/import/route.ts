import { NextResponse } from 'next/server';
import { createRoom } from '@/app/dashboard/admin/rooms/actions';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    for (const entry of data) {
      const { room_no, floor, status, room_type_id } = entry;

      if (!room_no || !floor || !status || !room_type_id) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const formData = new FormData();
      formData.set('room_no', room_no);
      formData.set('floor', String(floor));
      formData.set('status', status);
      formData.set('room_type_id', room_type_id);

      await createRoom(formData);
    }

    return NextResponse.json({ message: 'Import successful' });
  } catch (error) {
    console.error('Room Import Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
