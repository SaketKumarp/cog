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

// we well pass the text will get the embeddings from here
