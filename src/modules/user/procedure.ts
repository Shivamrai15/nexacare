import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    protectedProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";
import {
    CertificateSchema,
    PersonalInfoSchema,
    MedicalRecordSchema,
    CaregiverProfileSchema,
    EmergencyContactSchema,
    ChargesSchema,
    AvailabilitySchema,
} from "./schema";
import { qdarnt } from "@/lib/qdrant";
import { generateEmbeddings } from "@/lib/embedding";
import { v4 as uuidv4 } from "uuid";

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

        if (user.role === "CAREGIVER" && !user.caregiver) {
            await db.caregiver.create({
                data : {
                    userId : user.id,
                    vectorId : uuidv4(),
                }
            });
        }

        if (user.role === "CUSTOMER" && !user.customer) {
            await db.customer.create({
                data : {
                    userId : user.id,
                }
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

    updateProfessionalInfo : protectedProcedure.input(CaregiverProfileSchema).mutation(async({ctx, input})=>{
        const updatedCaregiver = await db.caregiver.update({
            where : {
                userId : ctx.userId
            },
            data : {
                description : input.description,
                experience : input.experience,
                languages : input.languages,
                specializations : input.specializations,
            },
            include : {
                user : {
                    select : {
                        name : true,
                        address : true,
                    }
                }
            }
        });

        const vectorId = updatedCaregiver.vectorId;
        const textToEmbed = `${updatedCaregiver.user.name} ${updatedCaregiver.user.address?.city || ''} ${updatedCaregiver.user.address?.state || ''} ${input.specializations.join(' ')}`;
        const embedding = await generateEmbeddings(textToEmbed);
        
        await qdarnt.upsert("caregiver_profile", {
            points : [{
                id : vectorId,
                vector : embedding,
                payload : {
                    caregiverId : updatedCaregiver.id,
                    userId : ctx.userId
                }
            }]
        });

        return updatedCaregiver;
    }),

    createCertificate : protectedProcedure.input(CertificateSchema).mutation(async({ctx, input})=>{
        const certificate = await db.certificate.create({
            data : {
                title : input.title,
                issuingBody : input.issuingBody,
                issueDate : new Date(input.issueDate),
                expiryDate : input.expiryDate ? new Date(input.expiryDate) : undefined,
                certificateUrl : input.certificateUrl,
                caregiver : {
                    connect : {
                        userId : ctx.userId
                    }
                }
            }
        });

        if (!certificate) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create certificate",
            });
        }

        return certificate;
    }),

    deleteCertificate : protectedProcedure.input(z.object({
        certificateId : z.string().min(1)
    })).mutation(async({ctx, input})=>{
        const certificate = await db.certificate.findFirst({
            where : {
                id : input.certificateId,
                caregiver : {
                    userId : ctx.userId
                }
            }
        });
        if (!certificate) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Certificate not found",
            });
        }

        await db.certificate.delete({
            where: {
                id: input.certificateId,
            },
        });

        return { success: true };
    }),

    createUpdateEmergencyContact : protectedProcedure.input(EmergencyContactSchema).mutation(async({ctx, input})=>{
        
        const caregiver = await db.caregiver.findUnique({
            where : {
                userId : ctx.userId
            },
            select : {
                id : true
            }
        });

        if (!caregiver) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Caregiver profile not found. Please complete your professional profile first.",
            });
        }
        
        const emergencyContact = await db.emergencyContact.upsert({
            where : {
                caregiverId : caregiver.id
            },
            create : {
                name : input.name,
                relationship : input.relationship,
                contactNumber : input.contactNumber,
                caregiver : {
                    connect : {
                        userId : ctx.userId
                    }
                }
            },
            update : {
                name : input.name,
                relationship : input.relationship,
                contactNumber : input.contactNumber
            }
        })

        if (!emergencyContact) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to save emergency contact",
            });
        }
        return emergencyContact;
    }),

    createUpdateCharges : protectedProcedure.input(ChargesSchema).mutation(async({ctx, input})=>{
        const caregiver = await db.caregiver.findUnique({
            where : {
                userId : ctx.userId
            },
            select : {
                id : true
            }
        });

        if (!caregiver) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Caregiver profile not found. Please complete your professional profile first.",
            });
        }

        const charges = await db.caregiverCharges.upsert({
            where : {
                caregiverId : caregiver.id
            },
            create : {
                hourlyRate : input.hourlyRate,
                visitFee : input.visitFee,
                currency : input.currency,
                caregiverId : caregiver.id,
                isNegotiable : input.isNegotiable,
            },
            update : {
                hourlyRate : input.hourlyRate,
                visitFee : input.visitFee,
                currency : input.currency,
                isNegotiable : input.isNegotiable,
            }
        })

        if (!charges) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to save charges",
            });
        }
        return charges;
    }),

    createAvailabilitySlot : protectedProcedure.input(AvailabilitySchema).mutation(async({ctx, input})=>{
        const availability = await db.availability.create({
            data : {
                dayOfWeek : input.dayOfWeek,
                startTime : input.startTime,
                endTime : input.endTime,
                caregiver : {
                    connect : {
                        userId : ctx.userId
                    }
                }
            }
        });
        if (!availability) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create availability slot",
            });
        }
        return availability;
    }),
    
    deleteAvailabilitySlot : protectedProcedure.input(z.object({ slotId : z.string().min(1) })).mutation(async({ctx, input})=>{
        const slot = await db.availability.findFirst({
            where : {
                id : input.slotId,
                caregiver : {
                    userId : ctx.userId
                }
            }
        });
        if (!slot) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Availability slot not found",
            });
        }
        await db.availability.delete({
            where : {
                id : input.slotId
            }
        });
        return { success : true };
    })
})