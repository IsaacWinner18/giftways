import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn() {
      // Optionally: Call your backend to create/update user and get a JWT
      // Example: await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/social-login`, { ... })
      return true;
    },
    async session({ session }) {
      // Optionally: Attach your backend JWT to the session here
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST }; 