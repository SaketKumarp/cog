"use client";

import { Button } from "@/components/ui/button";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { LayoutDashboard, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const Orgsidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-8 w-[220px] pl-5 pt-5 h-screen bg-transparent">
      {/* --- Logo Section --- */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <Image alt="logo" src="/logo.svg" height={40} width={40} />
          <span className="font-semibold text-2xl tracking-tight">Board</span>
        </Link>
      </div>

      {/* --- Organization Switcher --- */}
      <div className="w-full">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full scale-110",
              organizationSwitcherTrigger:
                "bg-[#1a1b26] hover:bg-[#24283b] border border-[#292e42] text-gray-200 w-full py-3 rounded-lg text-sm shadow-sm transition-all",
              organizationSwitcherPopoverCard:
                "bg-[#1a1b26] border border-[#292e42] shadow-lg rounded-xl",
            },
          }}
        />
      </div>

      {/* --- Navigation Buttons --- */}
      <div className="flex flex-col space-y-2 w-full">
        <Button
          variant={!favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal w-full justify-start transition"
        >
          <Link href="/">
            <LayoutDashboard className="h-5 w-5 mr-3 text-[#1abc9c]" />
            Team Boards
          </Link>
        </Button>

        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className="font-normal w-full justify-start  transition"
        >
          <Link href={{ pathname: "/", query: { favorites: true } }}>
            <Star className="h-5 w-5 mr-3 text-yellow-400" />
            Favorite Boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
