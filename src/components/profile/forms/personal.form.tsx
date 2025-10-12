import * as z from "zod";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PersonalInfoSchema } from "@/modules/user/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, MapPin, Phone } from "lucide-react";



export const PersonalForm = () => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const { data: profile } = useSuspenseQuery(trpc.user.getProfile.queryOptions());
    const updateProfile  = useMutation(trpc.user.updatePersonalInfo.mutationOptions({
        onSuccess : async(data)=>{
            await queryClient.invalidateQueries(trpc.user.getProfile.queryOptions());
            toast.success("Personal information updated successfully!");
        },
        onError : (error)=>{
            console.error(error);
            toast.error("Failed to update personal information. Please try again.");
        }
    }))

    const form  = useForm<z.infer<typeof PersonalInfoSchema>>({
        resolver : zodResolver(PersonalInfoSchema),
        defaultValues: {
            name : profile.name || "",
            bio : profile.bio || "",
            contactNumber : profile.contactNumber || "",
            street : profile.address?.street || "",
            city : profile.address?.city || "",
            state : profile.address?.state || "",
            zipCode : profile.address?.zipCode || "",
            country : profile.address?.country || "INDIA"
        }
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof PersonalInfoSchema>) => {
        await updateProfile.mutateAsync(data);
    };

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                    Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    Update your personal details and contact information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Basic Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2">
                                <User className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">Basic Information</h3>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Full Name <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                Contact Number <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <Input
                                                        type="tel"
                                                        placeholder="+1234567890"
                                                        className="h-11 rounded-lg pl-10"
                                                        {...field}
                                                        disabled={isSubmitting}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 pb-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold">Address</h3>
                            </div>

                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium">
                                            Street Address <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="123 Main Street, Apt 4B"
                                                className="h-11 rounded-lg"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid gap-4 md:grid-cols-3">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                City <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your city"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                State/Province <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Enter your state"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">
                                                ZIP/Postal Code <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="12345"
                                                    className="h-11 rounded-lg"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <CardFooter className="px-0 pt-4">
                            <Button
                                type="submit"
                                className="rounded-lg w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
