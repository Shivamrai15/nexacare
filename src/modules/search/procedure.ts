import {
    baseProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { qdarnt } from "@/lib/qdrant";
import { generateEmbeddings } from "@/lib/embedding";
import { SearchFormSchema } from "./schema";
import { Prisma } from "@/generated/prisma";

export const searchRouter = createTRPCRouter({
    query : baseProcedure.input(SearchFormSchema).mutation(async ({ input, ctx }) => {
        const generatedEmbeddings = await generateEmbeddings(`${input.searchQuery} ${input.serviceType}`);
        const vectorSearch = await qdarnt.search("caregiver_profile", {
            vector : generatedEmbeddings,
            limit : 20
        });

        const caregiverIds = vectorSearch.map(item => item.id as string);

        const whereClause: Prisma.CaregiverWhereInput = {
            AND: [
                {
                    vectorId: {
                        in: caregiverIds
                    }
                },
                ...(input.priceRange && input.priceRange.length === 2 
                    ? [{
                        charges: {
                            is: {
                                visitFee: {
                                    gte: input.priceRange[0],
                                    lte: input.priceRange[1]
                                }
                            }
                        }
                    }]
                    : []
                )
            ]
        };

        const caregivers = await db.caregiver.findMany({
            where: whereClause,
            select: {
                id: true,
                experience: true,
                vectorId: true,
                specializations: true,
                verificationStatus: true,
                languages: true,
                description: true,
                charges: {
                    select: {
                        hourlyRate: true,
                        visitFee: true,
                        currency: true,
                    }
                },
                reviews: {
                    select: {
                        rating: true
                    }
                },
                _count: {
                    select: {
                        reviews: true
                    }
                },
                user: {
                    select: {
                        name: true,
                        image: true,
                        address: {
                            select: {
                                city: true,
                                state: true,
                            }
                        }
                    }
                }
            }
        });


        const caregiversWithRating = caregivers.map(caregiver => {
            const avgRating = caregiver.reviews.length > 0
                ? caregiver.reviews.reduce((sum, review) => sum + review.rating, 0) / caregiver.reviews.length
                : 0;

            return {
                ...caregiver,
                averageRating: avgRating
            };
        });

        const sortedCaregivers = [...caregiversWithRating];

        switch (input.sortBy) {
            case "rating":
                sortedCaregivers.sort((a, b) => b.averageRating - a.averageRating);
                break;

            case "price-low":
                sortedCaregivers.sort((a, b) => {
                    const priceA = a.charges?.hourlyRate ?? Infinity;
                    const priceB = b.charges?.hourlyRate ?? Infinity;
                    return priceA - priceB;
                });
                break;

            case "price-high":
                sortedCaregivers.sort((a, b) => {
                    const priceA = a.charges?.hourlyRate ?? 0;
                    const priceB = b.charges?.hourlyRate ?? 0;
                    return priceB - priceA;
                });
                break;

            case "experience":
                sortedCaregivers.sort((a, b) => {
                    const expA = a.experience ?? 0;
                    const expB = b.experience ?? 0;
                    return expB - expA;
                });
                break;

            case "None":
                sortedCaregivers.sort((a, b) => {
                    const indexA = caregiverIds.indexOf(a.vectorId ?? '');
                    const indexB = caregiverIds.indexOf(b.vectorId ?? '');
                    return indexA - indexB;
                });
                break;
            default:
                sortedCaregivers.sort((a, b) => {
                    const indexA = caregiverIds.indexOf(a.vectorId ?? '');
                    const indexB = caregiverIds.indexOf(b.vectorId ?? '');
                    return indexA - indexB;
                });
                break;
        }
        const finalResults = sortedCaregivers.map(({ reviews, ...rest }) => rest);
        return finalResults;
    })

})