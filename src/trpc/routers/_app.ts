import { createTRPCRouter } from '../init';
import { authRouter } from '@/modules/auth/procedure';

export const appRouter = createTRPCRouter({
    auth : authRouter,
});

export type AppRouter = typeof appRouter;