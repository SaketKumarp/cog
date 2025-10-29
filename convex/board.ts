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

// create functionality

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity(); // get the user

    if (!user) throw new Error("unauthorized");
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: user.subject,
      authorname: user.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

// ctx (context)will have access to convex database

//delete functionality
export const deleteBoard = mutation({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("unauthorized");

    await ctx.db.delete(args.id);
  },
});

export const updateBoard = mutation({
  args: {
    title: v.string(),
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("unauthorized for update");

    const title = args.title.trim();
    if (!title) throw new Error("title is required");
    if (title.length > 60)
      throw new Error("title of more than 60 words is not required");

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});
