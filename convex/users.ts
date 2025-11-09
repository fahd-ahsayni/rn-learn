import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllUsers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});