import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Configure persistent sessionToken cookie and enhanced security
const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    ...authOptions.cookies,
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export { handler as GET, handler as POST };
