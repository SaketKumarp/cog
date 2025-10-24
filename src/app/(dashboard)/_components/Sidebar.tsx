import { OrgButton } from "./sidebar/org-button";
import { OrgList } from "./sidebar/org-list";

export const SideBar = () => {
  return (
    <div className="fixed z-1 left-0 w-[60px] bg-blue-900 min-h-screen p-3 flex flex-col">
      <OrgList />
      <OrgButton />
    </div>
  );
};
