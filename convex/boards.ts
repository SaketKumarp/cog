// we want all the boards of the particular org

import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBoards = query({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("unauthorised");
    const boards = await ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .order("desc")
      .collect();

    return boards;
  },
});
