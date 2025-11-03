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
  return Array.from(output.data);
};

// we well pass the text from audio to text model here not the text chunk actually

export function chunkTranscript(text: string, chunkSize: number): string[] {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}
