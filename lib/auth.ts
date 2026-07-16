import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    // Google, — enable after adding AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    // Database session strategy: expose the user id so every query
    // can be scoped by userId.
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
