import { userRouter } from '@/modules/user/procedure';
import { createTRPCRouter } from '../init';
import { authRouter } from '@/modules/auth/procedure';
import { searchRouter } from '@/modules/search/procedure';

export const appRouter = createTRPCRouter({
    auth : authRouter,
    user : userRouter,
    search : searchRouter,
});

export type AppRouter = typeof appRouter;