import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
 
export const ResendOTP = Resend({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 10, // 10 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    console.log(`Sending verification code ${token} to ${email}`);
    const { error, data } = await resend.emails.send({
      from: "contact@imfa.group",
      to: [email],
      subject: `Sign in to My App`,
      text: "Your code is " + token,
    });
 
    if (error) {
      console.error("Failed to send email:", JSON.stringify(error, null, 2));
      throw new Error(`Could not send verification email: ${error.message || JSON.stringify(error)}`);
    }
    
    console.log("Email sent successfully:", data);
  },
});