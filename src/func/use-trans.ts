import { pipeline, FeatureExtractionPipeline } from "@xenova/transformers";

let embedder: FeatureExtractionPipeline | null = null;

export const getEmbeddings = async (text: string): Promise<number[]> => {
  if (!embedder) {
    embedder = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )) as FeatureExtractionPipeline;
  }

  const output = await embedder(text, { pooling: "mean", normalize: true });
  console.log(output.dims);
  return Array.from(output.data);
};

// we well pass the text from audio to text model here not the text chunk actually

export const chunkTranscript = (text: string, maxTokens: number) => {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks: string[] = [];
  let current = "";

  sentences.forEach((sentence) => {
    if ((current + sentence).split(" ").length > maxTokens) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += " " + sentence;
    }
  });

  if (current.trim()) chunks.push(current.trim());
  return chunks;
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};
