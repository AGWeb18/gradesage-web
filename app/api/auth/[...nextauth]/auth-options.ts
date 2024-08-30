import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
import { Profile } from "next-auth";
import { Session } from "next-auth";

interface CustomUser extends User {
  googleId?: string;
  profileImage?: string;
  subscriptionType?: string;
}

interface CustomSession extends Session {
  user: {
    id?: string;
    subscriptionType?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const customUser = user as CustomUser;
        customUser.googleId = profile?.sub;
        customUser.profileImage = (profile as { picture?: string })?.picture;
      }
      return true;
    },
    async session({ session, user }): Promise<CustomSession> {
      const customSession = session as CustomSession;
      if (customSession.user && user) {
        customSession.user.id = user.id;
        customSession.user.subscriptionType = (user as CustomUser).subscriptionType;
      }
      return customSession;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};