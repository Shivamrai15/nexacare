import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
    baseProcedure,
    protectedProcedure,
    createTRPCRouter,
} from "@/trpc/init";
import { db } from "@/lib/db";
import { qdarnt } from "@/lib/qdrant";
import { generateEmbeddings } from "@/lib/embedding";
import { SearchFormSchema } from "./schema";

export const searchRouter = createTRPCRouter({
    query : baseProcedure.input(SearchFormSchema).mutation(async ({ input, ctx }) => {
        const generatedEmbeddings = await generateEmbeddings(input.searchQuery);
        const vectorSearch = await qdarnt.search("caregiver_profile", {
            vector : generatedEmbeddings,
            limit : 20
        });

        const caregiverIds = vectorSearch.map(item => item.id as string);
        const caregivers = await db.caregiver.findMany({
            where: {
                vectorId: {
                    in: caregiverIds
                },
            },
            select : {
                id: true,
                experience : true,
                _count : {
                    select : {
                        reviews : true
                    }
                },
                specializations : true,
                verificationStatus : true,
                languages : true,
                user : {
                    select : {
                        name : true,
                        image : true,
                    }
                }
            }
        });

        const sortedCaregivers = caregivers.sort((a, b) => {
            return caregiverIds.indexOf(a.id) - caregiverIds.indexOf(b.id);
        });

        return sortedCaregivers;
    })

})