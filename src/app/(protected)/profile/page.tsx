import { Suspense } from "react";
import type { Metadata } from "next";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Loader } from "@/components/usable/loader";
import { ProfileView } from "@/components/profile/ui/profile.view";

export const metadata: Metadata = {
  title: "My Profile | Nexacare",
  description: "View and update your Nexacare profile, manage health preferences, and connect with caregivers tailored to your needs.",
};

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
