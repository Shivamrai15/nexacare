import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    protectedProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";

export const userRouter = createTRPCRouter({
    getProfile : protectedProcedure.query(async({ctx})=>{
        const user = await db.user.findUnique({
            where : {
                id : ctx.userId
            },
            include : {
                customer : ctx.userRole === "CUSTOMER" ? {
                    include : {
                        medicalRecords : true,
                    }
                } : false,
                caregiver : ctx.userRole === "CAREGIVER" ? {
                    include : {
                        availability : true,
                        certificates : true,
                        charges : true,
                        emergencyContact : true
                    }
                } : false,
                address : true,
            }
        });

        if (!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }

        return user;
    })
})