"use client";

import { AudioUploader } from "@/components/audio/audioDrag";
import { Button } from "@/components/ui/button";
import { chunkTranscript, getEmbeddings } from "@/func/use-trans";
import { useSaveTranscript } from "@/hooks/use-save-trans";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";

interface PageProps {
  params: {
    boardId: string;
  };
}

export default function BoardPage({ params }: PageProps) {
  const { boardId } = params;

  const { mutate, loading } = useSaveTranscript();
  const { organization } = useOrganization();

  const handleClick = async () => {
    try {
      const transcript = `
The British brought cricket to India in the early 1700s, with the first cricket match played in 1721.[10] It was played and adopted by Kolis of Gujarat because they were sea pirates and outlaws who always looted the British ships, so the East India Company tried to manage the Kolis in cricket and been successful.[11][12][13] The first Indian cricket club was established by the Parsi community in Bombay, in 1848; the club played their first match against the Europeans in 1877.[14] In 1911, an Indian men's cricket team was formed and toured England, where they played English county teams.[15] The India men's team made their Test debut against England in 1932.[16] The first women's Test was played between England and Australia in 1934.[17]

Women's cricket arrived in India much later; the Women's Cricket Association of India (WCAI) was formed in 1973.[18] The Indian women's team played their first Test match in 1976, against the West Indies.[19] India recorded its first-ever Test win in November 1978 against West Indies under Shantha Rangaswamy's captaincy at the Moin-ul-Haq Stadium in Patna.[20][21]


Indian Batter at Cricket World Cup 2010

Mithali Raj, Captain of India Women's cricket team
The WCAI, the governing body for women's cricket, was affiliated to the International Women's Cricket Council. As part of the International Cricket Council's initiative to develop women's cricket, the Women's Cricket Association of India was merged with the Board of Control for Cricket in India in 2006/07.[22]

In 2021, the BCCI announced that Ramesh Powar would become the Head Coach of the Indian Women's Cricket Team.[23][24] In 2022, Indian Women script history by winning 1st series on England soil in 23 years.[25]

In July 2025, India clinched their first-ever Women’s T20I series win against England, securing an unassailable 3–1 lead in the five-match series. The landmark victory came in the fourth T20I at Worcester, where Indian spinners Radha Yadav, Deepti Sharma, and newcomer Shree Charani restricted England to 126/7. Openers Shafali Verma and Smriti Mandhana set up a comfortable six-wicket chase, finished with 18 balls to spare. The win marked a historic breakthrough, as India had never previously won a T20I series against England, either home or away. The performance, highlighted by disciplined bowling and sharp fielding, also served as vital preparation ahead of the 2026 ICC Women’s T20 World Cup in England.[26]
`;

      const chunks = chunkTranscript(transcript, 10);
      console.log("Chunks:", chunks);

      for (let i = 0; i < chunks.length; i++) {
        const textChunk = chunks[i];
        const embeddings = await getEmbeddings(textChunk);

        if (!organization) return;
        await mutate(
          {
            boardId,
            orgId: organization.id,
            transcript: textChunk,
            embeddings,
          },
          {
            onSuccess: (id) =>
              console.log(`✅ Saved chunk ${i + 1} with ID:`, id),
            onError: (err) => console.error(` Error on chunk ${i + 1}:`, err),
          }
        );
      }

      toast.success("All chunks processed and saved!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to process transcript.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Board ID: <span className="text-[#1abc9c]">{boardId}</span>
      </h1>

      <AudioUploader boardId={boardId} />
      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Saving..." : "Generate & Save Embeddings"}
      </Button>
    </div>
  );
}

// for now this transcript get stores in db in form of chunk and db
