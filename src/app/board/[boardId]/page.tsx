import React from "react";

interface boardPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default function BoardPage({ params }: boardPageProps) {
  const { boardId } = React.use(params);
  return <div> this is my :{boardId}</div>;
}
