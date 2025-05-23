// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string; // Add custom fields here
  }

  interface Session {
    user: {
      role: string; // Add the same fields here
    } & DefaultSession["user"];
  }

  interface JWT {
    role: string; // Include the custom fields in the JWT
  }
}
