import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/forms/sign-in.form";

export const metadata: Metadata = {
    title: "Sign In | Nexacare",
    description: "Access your Nexacare account to manage bookings, caregivers, and health services. Sign in securely to continue.",
};

const Page = () => {
    return (
        <div className="w-full">
            <SignInForm />
        </div>
    )
}

export default Page;