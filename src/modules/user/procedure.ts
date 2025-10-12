import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    protectedProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { MedicalRecordSchema, PersonalInfoSchema } from "./schema";

export const userRouter = createTRPCRouter({
    getProfile : protectedProcedure.query(async({ctx})=>{
        const user = await db.user.findUnique({
            where : {
                id : ctx.userId
            },
            include : {
                customer : {
                    include : {
                        medicalRecords : true,
                    }
                },
                caregiver : {
                    include : {
                        availability : true,
                        certificates : true,
                        charges : true,
                        emergencyContact : true
                    }
                },
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
    }),
    createMedicalRecord : protectedProcedure.input(MedicalRecordSchema).mutation(async({ctx, input})=>{
        const medicalRecord =  await db.medicalRecord.create({
            data: {
                title: input.title,
                description: input.description,
                type: input.type,
                recordDate: new Date(input.recordDate),
                textData: input.textData,
                fileUrl: input.fileUrl,
                customer : {
                    connect : {
                        userId : ctx.userId
                    }
                }
            }
        });

        if (!medicalRecord) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to add medical record",
            });
        }
        return medicalRecord;
    }),
    deleteMedicalRecord : protectedProcedure.input(z.object({
        recordId : z.string().min(1)
    })).mutation(async({ctx, input})=>{
        const record = await db.medicalRecord.findFirst({
            where : {
                id : input.recordId,
                customer : {
                    userId : ctx.userId
                }
            }
        });

        if (!record) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Medical record not found",
            });
        }

        await db.medicalRecord.delete({
            where: {
                id: input.recordId,
            },
        });

        return { success: true };
    }),
    updatePreferences : protectedProcedure.input(z.array(z.string())).mutation(async({ctx, input})=>{
        const updatedUser = await db.user.update({
            where : {
                id : ctx.userId
            },
            data : {
                preferences : input
            }
        });
        return updatedUser;
    }),
});