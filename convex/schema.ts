import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
// right now i am not breaking transcripts into smaller chunks may be next time..
// first i will see if it works on smaller audio files or not
export default defineSchema({
  boards: defineTable({
    title: v.string(),
    orgId: v.string(),
    authorId: v.string(),
    authorname: v.string(),
    imageUrl: v.string(),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),

  favorites: defineTable({
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
  })
    .index("by_board_id", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_User_board_org", ["userId", "boardId", "orgId"]),

  audios: defineTable({
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
    fileUrl: v.string(),
    transcript: v.string(),
    duration: v.optional(v.number()),
    title: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"]),

  queries: defineTable({
    boardId: v.string(),
    orgId: v.string(),
    userId: v.string(),
    query: v.string(),

    response: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_board", ["boardId"])
    .index("by_org", ["orgId"]),
  // table for transcript ... i will also store embeddings
  transcript: defineTable({
    boardId: v.string(),
    orgId: v.string(),
    userId: v.string(),
    transcript: v.string(),
    embeddings: v.array(v.float64()),
  })
    .index("by_boardId", ["boardId"])
    .index("by_user_id", ["userId"])
    .index("by_bord_org", ["boardId", "orgId"]),
});
