import { cosineSimilarity } from "@/func/use-trans";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadAudio = mutation({
  args: {
    storageId: v.id("_storage"),
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
    title: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);
    if (!fileUrl) throw new Error("file does not exist");
    const audioId = await ctx.db.insert("audios", {
      boardId: args.boardId,
      orgId: args.orgId,
      userId: args.userId,
      fileUrl,
      transcript: "",
      title: args.title ?? "Untitled",
      duration: args.duration,
      createdAt: Date.now(),
    });

    return audioId;
  },
});

//back-end for saving transcript

export const saveTranscript = mutation({
  args: {
    boardId: v.string(),
    transcript: v.string(),
    embeddings: v.array(v.float64()),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("unauthorized");

    const transcriptId = await ctx.db.insert("transcript", {
      boardId: args.boardId,
      orgId: args.orgId,
      userId: user.subject,
      transcript: args.transcript,
      embeddings: args.embeddings,
      createdAt: Date.now(),
    });

    return transcriptId;
  },
});

// fucn for how similar two embedings are

// search relavant transcript ... not sure but i will pass the context from here
export const findRelevantTranscripts = query({
  args: {
    orgId: v.string(),
    boardId: v.string(),
    queryEmbedding: v.array(v.float64()),
    topK: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new Error("Invalid User");

    const transcripts = await ctx.db
      .query("transcript")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();

    const scored = transcripts.map((t) => ({
      ...t,
      score: cosineSimilarity(args.queryEmbedding, t.embeddings),
    }));

    scored.sort((a, b) => b.score - a.score);
    const context = scored.slice(0, args.topK ?? 3);
    return context;
  },
});

// probably i m planning to save multiple trnascript .. i have to figure out how i wll store these into multiple chunks
