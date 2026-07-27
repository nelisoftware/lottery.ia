import prisma from "@/libraries/prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    user: {
      approved: boolean;
      isAdmin: boolean;
    } & DefaultSessionUser;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    approved?: boolean;
    isAdmin?: boolean;
  }
}

type DefaultSessionUser = NonNullable<import("next-auth").DefaultSession["user"]>;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        let approved = Boolean((user as { approved?: boolean }).approved);
        let isAdmin = Boolean((user as { isAdmin?: boolean }).isAdmin);

        if (user.email && user.email === process.env.ADMIN_EMAIL && (!approved || !isAdmin)) {
          const updated = await prisma.user.update({
            where: { id: user.id },
            data: { approved: true, isAdmin: true },
          });
          approved = updated.approved;
          isAdmin = updated.isAdmin;
        }

        token.approved = approved;
        token.isAdmin = isAdmin;
      }

      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          token.approved = dbUser.approved;
          token.isAdmin = dbUser.isAdmin;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.approved = Boolean(token.approved);
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    },
  },
});
