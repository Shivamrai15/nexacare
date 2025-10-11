"use server";

export async function sendEmailVerification(email: string, name: string, token: string) {
    try {
        
        const verificationURL = `${process.env.ORIGIN}/verification?token=${token}`;
        console.log("VERIFICATION URL:", verificationURL);

    } catch (error) {
        console.error("ERROR SENDING EMAIL:", error);
        throw new Error("Failed to send verification email");
    }
}