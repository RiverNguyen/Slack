import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");
  return code;
};

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "General",
      workspaceId,
    });

    return workspaceId;
  },
});

export const join = mutation({
  args: {
    joinCode: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { joinCode, workspaceId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const workspace = await ctx.db.get(workspaceId);

    if (!workspace) {
      throw new ConvexError("Workspace not found");
    }

    if (workspace.joinCode !== joinCode.toLowerCase()) {
      throw new ConvexError("Invalid join code");
    }

    const existingMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();

    if (existingMember) {
      throw new ConvexError("User already a member of this workspace");
    }

    await ctx.db.insert("members", {
      userId,
      workspaceId: workspace._id,
      role: "member",
    });

    return workspace._id;
  },
});

export const newJoinCode = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { workspaceId }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("User not authorized");
    }

    const joinCode = generateCode();

    await ctx.db.patch(workspaceId, {
      joinCode,
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getInfoById = query({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", id).eq("userId", userId)
      )
      .unique();

    const workspace = await ctx.db.get(id);

    return {
      name: workspace?.name,
      isMember: !!member,
    };
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const workspace = await ctx.db.get(id);

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", id).eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return workspace;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, { id, name }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("User not authorized");
    }

    await ctx.db.patch(id, {
      name,
    });

    return id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", id).eq("userId", userId)
      )
      .unique();

    if (!member || member.role !== "admin") {
      throw new ConvexError("User not authorized");
    }

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", id))
        .collect(),
    ]);

    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    await ctx.db.delete(id);

    return id;
  },
});
