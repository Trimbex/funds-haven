"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { getAccounts } from "@/app/api/accounts/account";
import { getCurrentUserID } from "@/app/api/general";
import { get } from "http";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const getSession = async () => {
      const  response = await getCurrentUserID(); 
      console.log("Session Data:", response.userId);
    };

    getSession();
  }, []);

  const fetchAccounts = async (userId: string) => {
    try {
      const data = await getAccounts(userId); // Call server action
      setAccounts(data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  return (
    <div>
      <h1>User ID Test</h1>
      <pre>{JSON.stringify(userId, null, 2)}</pre>

      <h2>User Accounts</h2>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </div>
  );
}
