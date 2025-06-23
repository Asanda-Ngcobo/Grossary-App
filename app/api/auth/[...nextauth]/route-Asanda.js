import { supabase } from "@/app/_lib/supabase";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";





export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       httpOptions: {
      timeout: 20000, // 10 seconds
    },
    }),
    
  ],
  //only needed during production
    cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production', // 🔑 critical for localhost
      },
    },
  },
   debug: true, // Enable debug mode
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .insert(
            {
              id: user.id, // Make sure this matches `auth.users.id`
              email: user.email,
              name: user.name,
              image: user.image,
              is_plus: false,
            },
            { onConflict: "id" } //