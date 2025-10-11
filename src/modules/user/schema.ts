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