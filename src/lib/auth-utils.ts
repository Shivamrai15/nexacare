import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    return session;
}


export const getSession = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    return session;
}


export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (session?.user) {
        redirect("/");
    }

    return session;
}

