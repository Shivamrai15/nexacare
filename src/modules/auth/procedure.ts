
import { TRPCError } from "@trpc/server";
import {
    baseProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { LoginSchema, SignUpSchema } from "./schemas";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendEmailVerification } from "@/lib/email";
import { generateVerificationToken } from "@/lib/token";


export const authRouter = createTRPCRouter({
    signIn : baseProcedure.input(LoginSchema).mutation(async({ input, ctx } ) => {

    }),
    signUp : baseProcedure.input(SignUpSchema).mutation(async({ input, ctx } ) => {
        const existingUser = await db.user.findUnique({
            where : {
                email : input.email
            }
        });

        if(existingUser) {
            throw new TRPCError({
                code : "CONFLICT",
                message : "User with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const createdUser = await db.user.create({
            data : {
                email : input.email,
                name : input.name,
                password : hashedPassword,
                role : input.role
            },
            select : {
                id : true,
            }
        });

        const token = await generateVerificationToken(input.email);

        if (!token) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to generate verification token",
            });
        }
        await sendEmailVerification(input.email, input.name, token);
        return createdUser;
    })
})