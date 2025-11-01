// import { action, mutation, query } from "./_generated/server";
// import { v } from "convex/values";
// import vosk from "vosk";
// import fs from "fs";
// import { api } from "./_generated/api";

// // Upload audio metadata
// export const uploadAudio = mutation({
//   args: { storageId: v.id("_storage"), boardId: v.id("boards") },
//   handler: async (ctx, args) => {
//     const fileUrl = await ctx.storage.getUrl(args.storageId);

//     const audioDoc = await ctx.db.insert("audios", {
//       boardId: args.boardId,
//       fileUrl,
//       transcript: "",
//       createdAt: Date.now(),
//     });

//     return audioDoc;
//   },
// });

// // Action for transcription
// export const transcribeAudio = action({
//   args: { audioUrl: v.string(), audioId: v.id("audios") },
//   handler: async (ctx, args) => {
//     vosk.setLogLevel(0);
//     const MODEL_PATH = "/path/to/vosk-model"; // adjust for your env
//     const model = new vosk.Model(MODEL_PATH);

//     const wf = fs.createReadStream(args.audioUrl, { highWaterMark: 4096 });
//     const rec = new vosk.Recognizer({ model, sampleRate: 16000 });

//     for await (const data of wf) {
//       rec.acceptWaveform(data);
//     }

//     const result = rec.finalResult();
//     const transcript = result?.text || "";

//     // ✅ Correct way to write to DB from an Action
//     await ctx.runMutation(api.audio.updateTranscript, {
//       audioId: args.audioId,
//       transcript,
//     });

//     return transcript;
//   },
// });

// // Mutation to update transcript (used inside the Action)
// export const updateTranscript = mutation({
//   args: { audioId: v.id("audios"), transcript: v.string() },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.audioId, { transcript: args.transcript });
//   },
// });

// export const getBoardAudios = query({
//   args: { boardId: v.id("boards") },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("audios")
//       .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
//       .order("desc")
//       .collect();
//   },
// });
