

import { Header } from "@/components/ui/header";
import { Toaster } from "@/components/ui/sonner"


type Props = {
    children: React.ReactNode;
};


const DashboardLayout = ({ children }: Props) =>{

    return (
        <>
        <Header />
        
        <main className="">
            {children}
            <Toaster richColors position="top-left" />
        </main>
        </>
    )

}

export default DashboardLayout;