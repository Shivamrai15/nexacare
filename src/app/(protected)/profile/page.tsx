import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Loader } from "@/components/usable/loader";
import { ProfileView } from "@/components/profile/ui/profile.view";

const Page = () => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.user.getProfile.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)} >
            <Suspense fallback={<Loader/>}>
                <ProfileView />
            </Suspense>
        </HydrationBoundary>
    )
}

export default Page;
