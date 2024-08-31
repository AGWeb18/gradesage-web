import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
import { Profile } from "next-auth";
import { Session } from "next-auth";
import { redis } from '@/lib/redis';

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
        
        try {
          // Check if user exists in Redis
          const userKey = `user:${user.email}`;
          const existingUser = await redis.hgetall(userKey);
          
          if (!existingUser.email) {
            // New user, set default subscription type
            await redis.hmset(userKey, {
              email: user.email,
              name: user.name || '',
              subscriptionType: "Free",
              createdAt: Date.now().toString(),
            });
            console.log(`New user created in Redis: ${user.email}`);
          } else {
            console.log(`Existing user signed in: ${user.email}`);
          }
        } catch (error) {
          console.error('Error during Redis operation in signIn:', error);
          // Consider whether to fail open or closed based on your security requirements
          // For now, we'll allow the sign-in to proceed even if Redis operations fail
        }
      }
      return true;
    },
    async session({ session, user }): Promise<CustomSession> {
      const customSession = session as CustomSession;
      if (customSession.user && customSession.user.email) {
        try {
          const userKey = `user:${customSession.user.email}`;
          const subscriptionType = await redis.hget(userKey, 'subscriptionType');
          customSession.user.subscriptionType = subscriptionType || "Free";
        } catch (error) {
          console.error('Error fetching user subscription type from Redis:', error);
          customSession.user.subscriptionType = "Free"; // Default to Free if there's an error
        }
      }
      return customSession;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};