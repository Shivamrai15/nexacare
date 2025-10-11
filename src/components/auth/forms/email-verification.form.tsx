"use client";

import { useTRPC } from "@/trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, LoaderIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export const EmailVerificationForm = () => {
    
    const trpc = useTRPC();
    const [ error, setError ] = useState<string|undefined>();
    const [ success, setSuccess ] = useState<string|undefined>();

    const verifyUser = useMutation(trpc.auth.verifyEmail.mutationOptions({
        onError : (err) => setError(err.message),
        onSuccess : () => setSuccess("Email verified successfully. You can now log in.")
    }))
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const verifyToken = useCallback(async () => {
        if (success || error) return;

        if (!token) {
            setError("Invalid verification link");
            return;
        }

        await verifyUser.mutateAsync({ token });
        
    }, [token, error, success]);

    useEffect(()=>{
        verifyToken();
    }, [verifyToken]);
    
    return (
        <div className="max-w-sm w-full p-4 rounded-md py-6 flex flex-col gap-y-6 justify-center">
            <div className="w-full flex items-center justify-center">
                {
                    !error && !success && (
                        <div className="flex items-center justify-center py-10 ">
                            <LoaderIcon className="text-zinc-700 size-5 animate-spin" />
                        </div>
                    )
                }
                {
                    error && (
                        <div className="bg-red-100 p-4 flex flex-col items-center gap-3 px-6 text-sm text-red-600 cursor-default rounded-md">
                            <AlertTriangle className="h-6 w-6"/>
                            <p className="font-medium select-none text-pretty text-center">{error}</p>
                        </div>
                    )
                }
                {
                    success && (
                        <div className="bg-emerald-100 p-4 flex flex-col items-center gap-3 px-6 text-sm text-emerald-600 cursor-default rounded-md">
                            <CheckCircle2 className="h-6 w-6"/>
                            <p className="font-medium select-none text-pretty text-center">{success}</p>
                        </div>
                    )
                }
            </div>
            {
                ( error || success ) && (
                    <Button
                        onClick={()=>router.push("/sign-in")}
                        disabled = { !error && !success  }
                    >
                        Back to login
                    </Button>
                )
            }
        </div>
    )
}