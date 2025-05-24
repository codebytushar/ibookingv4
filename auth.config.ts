import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Example: Adding a role field
      }
      return token;
    },
    async session({ session, token }) {
      // Include additional fields in the session
      if (token) {
        session.user.role = token.role; // Example
      
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {

      const isOnLandingPage = nextUrl.pathname === '/';
      if(isOnLandingPage) {return true;}

      const isLoggedIn = !!auth?.user;
      if(!isLoggedIn) {return false;}
      
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdminDashboard = nextUrl.pathname.startsWith('/dashboard/admin');
 
      
      if (isOnAdminDashboard && auth.user.role !== 'admin') return false;
      if (isOnDashboard) return true;
      return Response.redirect(new URL('/dashboard', nextUrl));

   
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;