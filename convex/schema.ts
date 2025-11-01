import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- Existing tables ---
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
    createdAt: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_user", ["userId"])
    .index("by_org", ["orgId"]),

  embeddings: defineTable({
    audioId: v.id("audios"),
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
    embedding: v.array(v.float64()), // vector embedding (e.g. 1536 floats)
    model: v.string(), // which embedding model was used (e.g. "text-embedding-3-large")
    createdAt: v.number(),
  })
    .index("by_audio", ["audioId"])
    .index("by_board", ["boardId"])
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"]),
});
