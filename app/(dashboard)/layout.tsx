import { Header } from "@/components/ui/header";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import { AccountsProvider } from "@/app/context/accountContext";

const inter = Inter({ subsets: ["latin"] }); // Load the Inter font

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className={`${inter.className} min-h-screen`}>
        <AccountsProvider>
          {children}
        </AccountsProvider>
        <Toaster richColors position="top-left" />
      </main>
    </>
  );
};

export default DashboardLayout;
