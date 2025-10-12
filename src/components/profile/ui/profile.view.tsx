"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "./header";
import { useSession } from "next-auth/react";
import { PersonalForm } from "../forms/personal.form";
import { cn } from "@/lib/utils";
import { MedicalForm } from "../forms/medical.form";


export const ProfileView = () => {

    const session = useSession();
   
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Header />
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className={cn(
                        "grid w-full",
                        session.data?.user.role === "CUSTOMER" ? "md:grid-cols-3" : "md:grid-cols-4"
                    )}>
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        {session.data?.user.role === "CUSTOMER" ? (
                            <>
                                <TabsTrigger value="medical">Medical Records</TabsTrigger>
                                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                            </>
                        ) : (
                            <>
                                <TabsTrigger value="professional">Professional</TabsTrigger>
                                <TabsTrigger value="services">Services</TabsTrigger>
                                <TabsTrigger value="availability">Availability</TabsTrigger>
                            </>
                        )}
                    </TabsList>
                    <TabsContent value="personal">
                        <PersonalForm />
                    </TabsContent>
                    <TabsContent value="medical">
                        <MedicalForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
