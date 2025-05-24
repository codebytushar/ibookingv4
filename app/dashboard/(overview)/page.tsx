// app/(protected)/dashboard/page.tsx

import { auth } from '@/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';


export default async function Dashboard() {
  const session = await auth();
  const role = session?.user?.role;

   if (role === 'admin') {
    redirect('/dashboard/admin');
  } else if (role === 'sevak') {
    redirect('/dashboard/sevak');
  } else if (role === 'guest') {
    redirect('/dashboard/guest');
  }

  return (
    <>
    Dashboard
    </>
  );
}
