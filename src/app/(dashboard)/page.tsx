import { redirect } from "next/navigation";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";
import { auth } from "@clerk/nextjs/server";

interface DashBoardPageProps {
  searchParams: {
    search?: string;
    favorites?: boolean;
  };
}

export default async function DashBoardPage({
  searchParams,
}: DashBoardPageProps) {
  const { userId, orgId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="flex-1 h-[calc(100%-80px)] pt-6">
      {!orgId ? <EmptyOrg /> : <BoardList orgId={orgId} query={searchParams} />}
    </div>
  );
}
