import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseServer } from "@/app/_lib/supabase-server";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
  async jwt({ token, user, account }) {
    if (account && user) {
      token.id = account.providerAccountId; // this is Google's user ID
    }
    return token;
  },

  async session({ session, token }) {
    session.user.id = token.id;
    return session;
  },

  async signIn({ user, account, profile }) {
    const userId = account?.providerAccountId; // Google's unique user ID

    const { data, error } = await supabaseServer
      .from("user_profiles")
      .upsert({
        id:user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      })
      .select();

    if (error) {
      console.error("Supabase sync error:", error.message);
      return false;
    }

    return true;
  },
}

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

