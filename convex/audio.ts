import { mutation, action, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const uploadAudio = mutation({
  args: {
    storageId: v.id("_storage"),
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const fileUrl = await ctx.storage.getUrl(args.storageId);

    const audioId = await ctx.db.insert("audios", {
      boardId: args.boardId,
      orgId: args.orgId,
      userId: args.userId,
      fileUrl,
      transcript: "",
      duration: undefined,
      createdAt: Date.now(),
    });

    return audioId;
  },
});

export const transcribeAudio = action({
  args: {
    audioUrl: v.string(),
    audioId: v.id("audios"),
    modelPath: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const transcript = `Simulated transcript from ${args.audioUrl}`;

    await ctx.runMutation(api.audio.updateTranscript, {
      audioId: args.audioId,
      transcript,
    });

    return transcript;
  },
});

export const updateTranscript = mutation({
  args: { audioId: v.id("audios"), transcript: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.audioId, { transcript: args.transcript });
  },
});

// i will change it based on the model i will be using
export const generateEmbeddings = action({
  args: {
    audioId: v.id("audios"),
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: args.transcript,
        model: "text-embedding-3-small",
      }),
    });

    const json = await response.json();
    const embedding = json.data?.[0]?.embedding;

    if (!embedding) throw new Error("Failed to create embedding");

    await ctx.runMutation(api.audio.storeEmbedding, {
      audioId: args.audioId,
      boardId: args.boardId,
      orgId: args.orgId,
      userId: args.userId,
      embedding,
      model: "text-embedding-3-small",
    });

    return embedding;
  },
});

export const storeEmbedding = mutation({
  args: {
    audioId: v.id("audios"),
    boardId: v.id("boards"),
    orgId: v.string(),
    userId: v.string(),
    embedding: v.array(v.float64()),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("embeddings", {
      audioId: args.audioId,
      boardId: args.boardId,
      orgId: args.orgId,
      userId: args.userId,
      embedding: args.embedding,
      model: args.model,
      createdAt: Date.now(),
    });
  },
});

export const getBoardAudios = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("audios")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();
  },
});

export const getEmbeddingsByBoard = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("embeddings")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});
