'use server'

import { supabase } from '@/app/utils/supabase/client'
import { db } from '@/app/db/index'
import * as t from '@/app/db/schema'
import { eq } from 'drizzle-orm';

// export async function getUserID() {
//     const { data: { session } } = await supabase.auth.getSession();
    
//     if (session) {
//         console.log("User ID:", session.user.id);
//         return session.user.id;
//     } else {
//         console.log("No user signed in.");
//         return null;
//     }
// }

export async function addUser(id:string , firstName: string, lastName: string, email: string) {

    await db.insert(t.users).values({
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName
      }); 
    
} 

