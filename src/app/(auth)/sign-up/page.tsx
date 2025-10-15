import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/forms/sign-up.form";

export const metadata: Metadata = {
  title: "Sign Up | Nexacare",
  description: "Join Nexacare to find trusted caregivers, nurses, and home health services. Create your free account today.",
};


const Page = () => {
    return (
        <div className="w-full">
            <SignUpForm />
        </div>
    )
}

export default Page;
