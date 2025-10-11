import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    protectedProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { PersonalInfoSchema } from "./schema";

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
    }),
    updatePersonalInfo : protectedProcedure.input(PersonalInfoSchema).mutation(async({ctx, input})=>{
        const updatedUser = await db.user.update({
            where : {
                id : ctx.userId
            },
            data : {
                name : input.name,
                contactNumber : input.contactNumber,
                bio : input.bio,
                address : {
                    upsert : {
                        create : {
                            street : input.street,
                            city : input.city,
                            state : input.state,
                            zipCode : input.zipCode,
                            country : input.country,
                        },
                        update : {
                            street : input.street,
                            city : input.city,
                            state : input.state,
                            zipCode : input.zipCode,
                            country : input.country,
                        }
                    }
                }
            }
        });
        return updatedUser;
    })
})