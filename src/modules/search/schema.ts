import { z } from "zod";

export const SearchFormSchema = z.object({
    searchQuery: z.string(),
    serviceType: z.string().optional(),
    sortBy: z.enum(["rating", "price-low", "price-high", "experience"]),
    priceRange: z.tuple([z.number(), z.number()]),
});