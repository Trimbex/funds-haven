import { Header } from "@/components/ui/header";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] }); // Load the Inter font

type Props = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className={`${inter.className} min-h-screen`}>
        {children}
        <Toaster richColors position="top-left" />
      </main>
    </>
  );
};

export default DashboardLayout;
