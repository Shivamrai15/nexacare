import superjson from "superjson";
import { cache } from "react";
import { initTRPC, TRPCError } from "@trpc/server";
import { getSession } from "@/lib/auth-utils";
import { UserRole } from "@/generated/prisma";

export const createTRPCContext = cache(async() => {
    return {
        auth : await getSession()
    };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.context<Context>().create({
    transformer: superjson
});

const isAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.auth?.user?.id) {
        throw new TRPCError({
            code : "UNAUTHORIZED",
            message : "You must be logged in to access this resource."
        });
    }
    return next({
        ctx: {
            ...ctx,
            userId: ctx.auth.user.id,
            userRole: ctx.auth.user.role as UserRole
        }
    });
})

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);