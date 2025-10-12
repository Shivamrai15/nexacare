import { z } from "zod";

export const PersonalInfoSchema = z.object({
    name : z.string().min(2, "Name is too short").max(100, "Name is too long"),
    bio : z.string().max(500, "Bio is too long").optional(),
    contactNumber : z.string().min(10, "Invalid contact number").max(15, "Contact number too long").regex(/^\+?[1-9]\d{1,14}$/, "Invalid contact number format"),
    street : z.string().min(2, "Street is too short").max(100, "Street is too long"),
    city : z.string().min(2, "City is too short").max(50, "City is too long"),
    state : z.string().min(2, "State is too short").max(50, "State is too long"),
    zipCode : z.string().min(4, "Zip code is too short").max(10, "Zip code is too long"),
    country : z.string()
});


export const MedicalRecordSchema = z.object({
    title: z.string().min(2, "Title is required").max(100, "Title is too long"),
    description: z.string().max(500, "Description is too long").optional(),
    type: z.enum(["IMAGE", "PDF", "TEXT"]),
    recordDate: z.string().min(1, "Record date is required"),
    textData: z.string().max(5000, "Text data is too long").optional(),
    fileUrl: z.string().url("Invalid URL format").optional(),
});

export const CaregiverProfileSchema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description is too long").optional(),
    experience: z.number().min(0, "Experience cannot be negative").max(50, "Experience seems too high").optional(),
    languages: z.array(z.string()).min(1, "At least one language is required"),
    specializations: z.array(z.string()).min(1, "At least one specialization is required"),
});

export const CertificateSchema = z.object({
    title: z.string().min(2, "Title is required").max(100, "Title is too long"),
    issuingBody: z.string().min(2, "Issuing body is required").max(100, "Issuing body is too long"),
    issueDate: z.string().min(1, "Issue date is required"),
    expiryDate: z.string().optional(),
    certificateUrl: z.string().min(1, "Certificate file is required"),
});

export const EmergencyContactSchema = z.object({
    name: z.string().min(2, "Name is required").max(100, "Name is too long"),
    relationship: z.string().min(2, "Relationship is required").max(50, "Relationship is too long"),
    contactNumber: z.string().min(10, "Invalid contact number").max(15, "Contact number is too long"),
    email: z.email("Invalid email").optional().or(z.literal("")),
});