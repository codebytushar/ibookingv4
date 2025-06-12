// app/(protected)/dashboard/page.tsx

import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  const user = {
    id: session?.user.id,
    name: session?.user.name,
    email: session?.user.email,
    role: session?.user.role,
    };
  return (
    <div>
      {user.role === 'admin' && redirect('/dashboard/admin')}
      {user.role === 'volunteer' && redirect('/dashboard/volunteer')}
      {user.role === 'guest' && redirect('/dashboard/guest')}
    </div>
  )
}
