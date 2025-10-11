"use client";

import * as z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/modules/auth/schemas";
import {
    Form,
    FormControl,
    FormLabel,
    FormItem,
    FormField,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignInForm = () => {
    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues : {
            email : "",
            password : ""
        }
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (data : z.infer<typeof LoginSchema>) => {
        try {

        } catch (error) {
            console.error("LOGIN FORM ERROR", error);
            window.location.reload();
        }
    }

    return (
        <div className="max-w-md w-full mx-auto space-y-12">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome Back
                </h1>
                <p className="text-muted-foreground font-medium">
                    Sign in to your account
                </p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-5">
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
                                    <div className="items-center justify-between hidden">
                                        <Link 
                                            href="/forgot-password" 
                                            className="text-sm text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            className="h-11 px-4 rounded-xl border-input"
                                            {...field}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <Button className="w-full h-11 rounded-xl font-semibold" type="submit" disabled={isSubmitting} >
                        Sign In
                    </Button>
                    
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                            Don&apos;t have an account?{" "}
                            <Link 
                                href="/sign-up" 
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Create account
                            </Link>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}
