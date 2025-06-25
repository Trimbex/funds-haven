import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { AccountsProvider } from "@/app/context/accountContext";

const inter = Inter({ subsets: ["latin"] }); // Load the Inter font

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        
        <main className={`${inter.className} flex-1 custom-scrollbar overflow-auto`}>
          <AccountsProvider>
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </AccountsProvider>
        </main>
        
        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
};

export default DashboardLayout;
