import NextAuth from 'next-auth';
import { authOptions } from '@/auth'; // Adjust if your path is different

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
