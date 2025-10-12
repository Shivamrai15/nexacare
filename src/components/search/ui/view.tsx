"use client";

import { z } from "zod";
import { useTRPC } from "@/trpc/client";
import { SearchForm } from "../forms/search.form";
import { useMutation } from "@tanstack/react-query";
import { SearchFormSchema } from "@/modules/search/schema";
import { Loader, AlertCircle, Search as SearchIcon } from "lucide-react";
import { SearchResults } from "./search-result";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SearchFormValues = z.infer<typeof SearchFormSchema>;

export const SearchView = () => {

    const trpc = useTRPC();
    const { mutate: search, data, isPending, isError, error } = useMutation(trpc.search.query.mutationOptions());

    const handleSearch = async(values: SearchFormValues) => {
        search(values);
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8 relative mt-20">
            <div className="w-full">
                <SearchForm
                    onSearch={handleSearch}
                />
            </div>
            <div className="w-full lg:col-span-2">
                { isPending ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <Loader className="size-8 text-zinc-600 animate-spin mx-auto mb-4" />
                                <p className="text-muted-foreground">Searching for caregivers...</p>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <Alert variant="destructive" className="max-w-md">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error?.message || "Something went wrong while searching. Please try again."}
                                </AlertDescription>
                            </Alert>
                        </div>
                    ) : data?.length ? (
                        <SearchResults data={data} />
                    ) : data ? (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center p-4">
                                <div className="text-6xl mb-4">😔</div>
                                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                                <p className="text-sm text-muted-foreground">
                                    Try adjusting your search or filter to find what you&apos;re looking for.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center min-h-[400px]">
                            <div className="text-center p-4">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
                                <p className="text-sm text-muted-foreground">
                                    Use the filters to find the perfect caregiver for your needs.
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
