"use client";

import {
  OrganizationSwitcher,
  UserButton,
  useOrganization,
} from "@clerk/nextjs";
import { SearchInput } from "./search-input";
import { Invitemembers } from "./invite-member";
import { CreateBoard } from "./board/create-board";

export const Navbar = () => {
  const { organization } = useOrganization();
  return (
    <div className="top-0  h-[100px]  gap-x-5 flex items-center">
      <div className="hidden lg:flex lg:flex-1  ">
        <SearchInput />
      </div>
      <CreateBoard />

      <div className="block lg:hidden flex-1">
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox: "w-full scale-110 scale-125",

              organizationSwitcherTrigger:
                "bg-[#1a1b26] hover:bg-[#24283b] border border-[#292e42] text-gray-200 w-full py-3 rounded-lg text-sm shadow-sm transition-all",
              organizationSwitcherPopoverCard:
                "bg-[#1a1b26] border border-[#292e42] shadow-lg rounded-xl",
            },
          }}
        />
      </div>
      {organization && <Invitemembers />}
      <UserButton />
    </div>
  );
};
