// we want all the boards of the particular org

import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships";
export const getBoards = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("unauthorised");
    // collecting favorite board
    const favoriteBoards = await ctx.db
      .query("favorites")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", user.subject).eq("orgId", args.orgId)
      )
      .order("desc")
      .collect();

    if (args.favorite) {
      const ids = favoriteBoards.map((fav) => fav.boardId);
      const favBoards = await getAllOrThrow(ctx.db, ids);
      return favBoards.map((b) => ({
        ...b,
        isFavorite: true, // just returning a board as i am querying the already Favorited board
      }));
    }

    const title = args.search as string;
    let boards = [];

    // query using search
    if (title) {
      boards = await ctx.db
        .query("boards")
        .withSearchIndex("search_title", (q) =>
          q.search("title", title).eq("orgId", args.orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }

    const boardsWithFavoriteRelations = boards.map(async (board) => {
      return ctx.db
        .query("favorites")
        .withIndex("by_user_board", (q) =>
          q.eq("userId", user.subject).eq("boardId", board._id)
        )
        .unique()
        .then((favorite) => {
          return {
            ...board,
            isFavorite: !!favorite,
          };
        });
    });
    const boardsWithFavoriteBoolean = Promise.all(boardsWithFavoriteRelations);
    return boardsWithFavoriteBoolean;
  },
});

export const get = query({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);
    return board;
  },
});
