"use client";

import { redirect } from "next/navigation";

import { EmptyOrg } from "./_components/empty-org";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { BoardList } from "./_components/board-list";
interface DashBoardPageProps {
  searchParams: {
    search?: string;
    favorites?: boolean;
  };
}

export default function DashBoardPage({ searchParams }: DashBoardPageProps) {
  const { userId } = useAuth();
  const { organization } = useOrganization();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className=" flex-1 h-[calc(100%-80px)] pt-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={searchParams} />
      )}
    </div>
  );
}
