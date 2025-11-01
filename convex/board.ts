import { v } from "convex/values";
import { mutation } from "./_generated/server";

const images = [
  "/placeholder/1.svg",
  "/placeholder/2.svg",
  "/placeholder/3.svg",
  "/placeholder/4.svg",
  "/placeholder/5.svg",
  "/placeholder/6.svg",
  "/placeholder/7.svg",
  "/placeholder/8.svg",
  "/placeholder/9.svg",
  "/placeholder/10.svg",
];

// Create a new board
export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const boardId = await ctx.db.insert("boards", {
      title: args.title.trim(),
      orgId: args.orgId,
      authorId: user.subject,
      authorname: user.name ?? "Unknown",
      imageUrl: randomImage,
    });

    return { _id: boardId };
  },
});

// Delete a board
export const deleteBoard = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});

// Update a board title
export const updateBoard = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");

    const title = args.title.trim();
    if (!title) throw new Error("Title required");
    if (title.length > 60) throw new Error("Title too long");

    await ctx.db.patch(args.id, { title });
  },
});

// Favorite a board
export const favorite = mutation({
  args: {
    boardId: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
    const userId = user.subject;

    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_User_board_org", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", args.boardId)
          .eq("orgId", args.orgId)
      )
      .unique();

    if (existing) throw new Error("Already favorited");

    await ctx.db.insert("favorites", {
      userId,
      boardId: args.boardId,
      orgId: args.orgId,
    });

    return { _id: board._id };
  },
});

// Unfavorite a board
export const unfavorite = mutation({
  args: {
    boardId: v.id("boards"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Unauthorized");
    const userId = user.subject;

    const existing = await ctx.db
      .query("favorites")
      .withIndex("by_User_board_org", (q) =>
        q
          .eq("userId", userId)
          .eq("boardId", args.boardId)
          .eq("orgId", args.orgId)
      )
      .unique();

    if (!existing) throw new Error("Favorite not found");

    await ctx.db.delete(existing._id);

    return { _id: args.boardId };
  },
});
