"use server";
import { verificationTemplate } from '@/templates/verification.template';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailVerification(email: string, name: string, token: string) {
    try {
        
        const verificationURL = `${process.env.ORIGIN}/verification?token=${token}`;
        const data = await resend.emails.send({
            from : "support@nexacare.wovi.me",
            to : email,
            subject : "Verify your account",
            html : verificationTemplate(email, name, verificationURL)
        });

    } catch (error) {
        console.error("ERROR SENDING EMAIL:", error);
        throw new Error("Failed to send verification email");
    }
}