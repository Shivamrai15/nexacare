import { userRouter } from '@/modules/user/procedure';
import { createTRPCRouter } from '../init';
import { authRouter } from '@/modules/auth/procedure';

export const appRouter = createTRPCRouter({
    auth : authRouter,
    user : userRouter
});

export type AppRouter = typeof appRouter;