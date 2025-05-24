import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include additional fields in the token
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
      const isOnLanding = nextUrl.pathname == '/';
      if(isOnLanding) return true;
      const isLoggedIn = !!auth?.user;
      if(!isLoggedIn) {return false;}
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdminDashboard = nextUrl.pathname.startsWith('/dashboard/admin');
      const isOnHodDashboard = nextUrl.pathname.startsWith('/dashboard/hod');
      const isOnStaffDashboard = nextUrl.pathname.startsWith('/dashboard/staff');
      const isOnStudentDashboard = nextUrl.pathname.startsWith('/dashboard/students');
      
      // if (isOnAdminDashboard && auth.user.role !== 'admin') return false;
      // if (isOnHodDashboard && auth.user.role !== 'hod') return false;
      // if (isOnStaffDashboard && auth.user.role !== 'staff') return false;
      // if (isOnStudentDashboard && auth.user.role !== 'student') return false;
      if (isOnDashboard) return true;
      
      return Response.redirect(new URL('/dashboard', nextUrl));

      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      // return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;