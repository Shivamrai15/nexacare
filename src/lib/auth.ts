import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";
import { sendEmailVerification } from "./email";

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "mongodb",
    }),
    emailAndPassword: { 
        enabled: true,
        requireEmailVerification : true
    },
    emailVerification : {
        sendVerificationEmail : async({ token, url, user }) => {
            await sendEmailVerification(user.email, user.name, url);
        },
        autoSignInAfterVerification: true
    },
    advanced : {
        database : {
            generateId : false
        },
    },
    user : {
        additionalFields : {
            role : {
                type : "string",
                fieldName : "role",
                defaultValue: "CUSTOMER",
                input: true,
                required : true,
            }
        }
    },
});