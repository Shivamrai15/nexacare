import NextAuth from "next-auth";
import { UserRole } from "@/generated/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/lib/auth.config";
import { getUserById } from "./user";
 
export const {
    handlers,
    signIn,
    signOut,
    auth
} = NextAuth({
    pages: {
        signIn: "/login",
        error: "/auth/error"
    },
    callbacks :{
        async session({session, token}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            return session;
        },
        async jwt({token}){
            const existingUser = await getUserById(token.sub||"");

            if (!existingUser) return token;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;

            return token;
        }
    },

    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})