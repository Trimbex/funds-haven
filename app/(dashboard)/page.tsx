'use client'

import { Button } from "@/components/ui/button";
import { WelcomeMessage } from "@/components/ui/welcome";
import { supabase } from '@/app/utils/supabase/client'



export default function Home() {
  return (
    <>
    
    <WelcomeMessage />
    <p>
      Logged on can see this msg 
    </p>
    </>

  );
}
