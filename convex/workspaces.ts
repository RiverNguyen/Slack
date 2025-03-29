import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const joinCode = "123456";

    const workspaceId = await ctx.db.insert("workspaces", {
      name,
      userId,
      joinCode,
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workspaces").collect();
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, { id }) => {
    const useId = await getAuthUserId(ctx);

    if (!useId) {
      throw new ConvexError("User not authenticated");
    }

    const workspace = await ctx.db.get(id);

    if (!workspace) {
      throw new ConvexError("Workspace not found");
    }

    return workspace;
  },
});
