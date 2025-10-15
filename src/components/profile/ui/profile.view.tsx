"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./header";
import { PersonalForm } from "../forms/personal.form";
import { cn } from "@/lib/utils";
import { MedicalForm } from "../forms/medical.form";
import { Preferences } from "../forms/preferences";
import { ProfessionalForm } from "../forms/professional.form";
import { AvailabilityForm } from "../forms/availability.form";


export const ProfileView = () => {

    const trpc = useTRPC();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());
   
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Header />
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className={cn(
                        "grid w-full grid-cols-3",
                    )}>
                        <TabsTrigger className="md:cursor-pointer" value="personal">Personal Info</TabsTrigger>
                        {profile.role === "CUSTOMER" ? (
                            <>
                                <TabsTrigger className="md:cursor-pointer" value="medical">Medical Records</TabsTrigger>
                                <TabsTrigger className="md:cursor-pointer" value="preferences">Preferences</TabsTrigger>
                            </>
                        ) : (
                            <>
                                <TabsTrigger className="md:cursor-pointer" value="professional">Professional</TabsTrigger>
                                <TabsTrigger className="md:cursor-pointer" value="availability">Availability</TabsTrigger>
                            </>
                        )}
                    </TabsList>
                    <TabsContent value="personal">
                        <PersonalForm />
                    </TabsContent>
                    <TabsContent value="medical">
                        <MedicalForm />
                    </TabsContent>
                    <TabsContent value="preferences">
                        <Preferences />
                    </TabsContent>
                    <TabsContent value="professional">
                        <ProfessionalForm />
                    </TabsContent>
                    <TabsContent value="availability">
                        <AvailabilityForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
