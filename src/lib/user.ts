"use server";

import { db } from "./db";

export async function getUserByEmail(email: string) {
    try {
        
        const user = await db.user.findUnique({
            where : {
                email
            }
        });

        return user;

    } catch (error) {
        console.error("ERROR GET USER BY EMAIL", error);
        return null;
    }
}

export async function getUserById(userId: string) {
    try {
        
        const user = await db.user.findUnique({
            where : {
                id: userId
            }
        });

        return user;

    } catch (error) {
        console.error("ERROR GET USER BY ID", error);
        return null;
    }
}