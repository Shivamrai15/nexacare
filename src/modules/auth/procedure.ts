
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import {
    baseProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { LoginSchema, SignUpSchema } from "./schemas";
import { db } from "@/lib/db";
import { sendEmailVerification } from "@/lib/email";
import { generateVerificationToken } from "@/lib/token";
import { signIn } from "@/lib/auth";
import { z } from "zod";
import { getUserByEmail } from "@/lib/user";

interface VerificationPayload {
    email: string;
    token: string;
}


export const authRouter = createTRPCRouter({
    signIn : baseProcedure.input(LoginSchema).mutation(async({ input, ctx } ) => {

        const user = await db.user.findUnique({
            where : {
                email : input.email
            }
        });
        
        if (!user || !user.password) {
            throw new TRPCError({
                code : "NOT_FOUND",
                message : "Account does not exist"
            });
        }

        const passwordMatched = await bcrypt.compare(input.password, user.password);
        
        if (!passwordMatched) {
            throw new TRPCError({
                code : "UNAUTHORIZED",
                message : "Invalid email or password"
            });
        }

        if (!user.emailVerified) {
            const verificationToken = await generateVerificationToken(user.email);
            if (!verificationToken) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to generate verification token"
                });
            }
            await sendEmailVerification( user.email, user?.name || "User", verificationToken);
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Please verify your email. A new verification link has been sent to your email address.",
            });
        }

        await signIn("credentials", {
            email : input.email,
            password : input.password,
        });

        return {
            message : "Logged in successfully",
        }
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

    }),
    verifyEmail : baseProcedure.input(z.object({
        token : z.string().min(1)
    })).mutation(async({ input, ctx }) => {

        const verificationToken  = input.token;

        const verifiedToken = jwt.verify(verificationToken, process.env.EMAIL_VERIFICATION_SECRET!) as VerificationPayload;
        
        if (!verifiedToken) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid verification token" });
        }

        const email = verifiedToken.email;
        const token = verifiedToken.token;

        if ( !email || !token ) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid verification token" });
        }

        const dbToken = await db.verificationToken.findFirst({
            where : {
                token,
                email
            }
        });

        if ( !dbToken ) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Your verification link is not valid, or already used." });
        }

        const hasExpired = new Date() > new Date(dbToken.expires);
        if (hasExpired) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Your verification link is not valid, or already used." });
        }

        const existingUser = await getUserByEmail(dbToken.email);
        if (!existingUser || !existingUser.password){
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Account does not exist." });
        }

        const user = await db.user.update({
            where : {
                id : existingUser.id
            },
            data  : {
                emailVerified : new Date()
            }
        });

        await db.verificationToken.delete({
            where : {
                id : dbToken.id
            }
        });

        return user;

    })
})