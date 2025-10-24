import { Orgsidebar } from "./_components/sidebar/Org-sidebar";
import { SideBar } from "./_components/Sidebar";
import { Navbar } from "./_components/navbar";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-full flex">
      <SideBar />
      <div className="pl-[60px] h-full flex-1">
        <div className="flex  h-full">
          <Orgsidebar />
          <div className="flex-1 h-full">
            <Navbar />
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
