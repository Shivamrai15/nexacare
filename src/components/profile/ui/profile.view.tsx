"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./header";
import { useSession } from "next-auth/react";
import { PersonalForm } from "../forms/personal.form";
import { cn } from "@/lib/utils";
import { MedicalForm } from "../forms/medical.form";
import { Preferences } from "../forms/preferences";
import { ProfessionalForm } from "../forms/professional.form";
import { AvailabilityForm } from "../forms/availability.form";


export const ProfileView = () => {

    const session = useSession();
   
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Header />
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className={cn(
                        "grid w-full grid-cols-3",
                    )}>
                        <TabsTrigger className="md:cursor-pointer" value="personal">Personal Info</TabsTrigger>
                        {session.data?.user.role === "CUSTOMER" ? (
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
