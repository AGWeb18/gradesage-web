import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
import { Session } from "next-auth";
import { kv } from '@/lib/kv';
import nodemailer from 'nodemailer';

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

async function sendNewUserAlert(user: CustomUser) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'riddinganthony@gmail.com',
      pass: 'dlzb gyjx lvdv qnof',
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'aridding18@gmail.com',
    subject: 'New User Signup - GradSage',
    text: `A new user has signed up for GradSage:
    
    Name: ${user.name}
    Email: ${user.email}
    Signup Date: ${new Date().toLocaleString()}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New user alert email sent');
  } catch (error) {
    console.error('Error sending new user alert email:', error);
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
          const userKey = `user:${user.email}`;
          const existingUser = await kv.hgetall(userKey);
          
          if (!existingUser || !existingUser.email) {
            await kv.hmset(userKey, {
              email: user.email,
              name: user.name || '',
              subscriptionType: "Free",
              createdAt: Date.now().toString(),
            });
            console.log(`New user created in KV: ${user.email}`);
             // Send new user alert email
            await sendNewUserAlert(user as CustomUser);

          } else {
            console.log(`Existing user signed in: ${user.email}`);
          }
        } catch (error) {
          console.error('Error during KV operation in signIn:', error);
        }
      }
      return true;
    },
    async session({ session, user }): Promise<CustomSession> {
      const customSession = session as CustomSession;
      if (customSession.user && customSession.user.email) {
        try {
          const userKey = `user:${customSession.user.email}`;
          const subscriptionType = await kv.hget(userKey, 'subscriptionType') as string;
          customSession.user.subscriptionType = subscriptionType || "Free";
        } catch (error) {
          console.error('Error fetching user subscription type from KV:', error);
          customSession.user.subscriptionType = "Free";
        }
      }
      return customSession;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};