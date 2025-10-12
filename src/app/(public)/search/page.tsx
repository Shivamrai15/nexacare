import type { Metadata } from "next";
import { SearchView } from "@/components/search/ui/view";

export const metadata: Metadata = {
  title: "Find Caregivers | Nexacare Search",
  description: "Search for trusted caregivers, nurses, and healthcare professionals near you. Discover compassionate care with Nexacare.",
};


const Page = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Find Your Perfect Caregiver</h1>
                <p className="text-muted-foreground text-center">Search and filter through our verified caregivers</p>
            </div>
            <SearchView />
        </div>
    )
}

export default Page
