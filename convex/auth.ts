import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import GitHub from "@auth/core/providers/github";
import { ResendOTPPasswordReset } from "./ResendOTPPasswordReset";
import { ResendOTP } from "./resendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({reset: ResendOTPPasswordReset, verify: ResendOTP}), GitHub],
});
