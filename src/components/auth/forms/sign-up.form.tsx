"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@/schemas/signup.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


export const SignUpForm = () => {
    
    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver : zodResolver(SignUpSchema),
        defaultValues: {
            role: "CUSTOMER",
            email: "",
            password: "",
            name: ""
        }
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        try {
            
            toast.success("Account created! Please check your email to verify your account.");

        } catch (error) {
            console.log(error);
            toast.error("An error occurred during sign up. Please try again.");
        }
    }
    
    return (
        <div className="max-w-md w-full space-y-8 mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Create Your Account
                </h1>
                <p className="text-muted-foreground font-medium">
                    Sign up to get started with Nexacare
                </p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">I am a</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card
                                                className={cn(
                                                    "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                                                    field.value === "CUSTOMER" 
                                                        ? "border-primary bg-primary/5" 
                                                        : "border-border hover:border-primary/50"
                                                )}
                                                onClick={() => field.onChange("CUSTOMER")}
                                            >
                                                <div className="flex flex-col items-center text-center space-y-2">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                                                        field.value === "CUSTOMER" 
                                                            ? "bg-primary/10" 
                                                            : "bg-muted"
                                                    )}>
                                                        👤
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Customer</h3>
                                                        <p className="text-xs text-muted-foreground">Looking for care</p>
                                                    </div>
                                                </div>
                                            </Card>
                                            <Card
                                                className={cn(
                                                    "p-4 cursor-pointer transition-all hover:shadow-md border-2",
                                                    field.value === "CAREGIVER" 
                                                        ? "border-primary bg-primary/5" 
                                                        : "border-border hover:border-primary/50"
                                                )}
                                                onClick={() => field.onChange("CAREGIVER")}
                                            >
                                                <div className="flex flex-col items-center text-center space-y-2">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                                                        field.value === "CAREGIVER" 
                                                            ? "bg-primary/10" 
                                                            : "bg-muted"
                                                    )}>
                                                        🩺
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Caregiver</h3>
                                                        <p className="text-xs text-muted-foreground">Providing care</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Enter your full name"
                                            className="h-11 px-4 rounded-xl border-input"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="h-11 px-4 rounded-xl border-input"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Create a secure password"
                                            className="h-11 px-4 rounded-xl border-input"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Must be at least 8 characters with uppercase, lowercase, and numbers
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-4">
                        <Button className="w-full h-11 rounded-xl font-semibold" type="submit" disabled={isSubmitting}>
                            Create Account
                        </Button>
                        
                        <div className="text-sm text-center text-muted-foreground">
                            By creating an account, you agree to our{" "}
                            <Link 
                                href="/terms" 
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Terms of Service
                            </Link>
                            {" "}and{" "}
                            <Link 
                                href="/privacy" 
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link 
                                href="/sign-in" 
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}
