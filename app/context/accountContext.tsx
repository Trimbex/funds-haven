import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { getCurrentUserID } from '@/app/api/general';

// Define types for our context
interface Account {
  account_id: string;
  account_name: string;
  account_type: string;
  balance: string;
  cardno: string;
  card_company: string;
  isVerified: boolean;
  created_at?: string;
}

interface NewAccount {
  accountName: string;
  accountType: string;
  balance: string;
  cardNumber: string;
  cardCompany?: string;
}

interface AccountsContextType {
  accounts: Account[];
  loading: boolean;
  dialogLoading: boolean;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  addAccount: (newAccount: NewAccount) => Promise<void>;
  updateAccount: (updatedAccount: Partial<Account> & { account_id: string }) => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
}

// Create context with default values
const AccountsContext = createContext<AccountsContextType>({
  accounts: [],
  loading: true,
  dialogLoading: false,
  showDialog: false,
  setShowDialog: () => {},
  addAccount: async () => {},
  updateAccount: async () => {},
  deleteAccount: async () => {},
});

// Hook to use the accounts context
export const useAccounts = () => useContext(AccountsContext);

// Provider component
interface AccountsProviderProps {
  children: ReactNode;
}

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);

  // Get User ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUserID(); 
        setUser(response.userId || null);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch accounts when user is available
  useEffect(() => {
    if (!user) return;
    
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?user_id=${user}`);
        const data = await response.json();
        if (data.success) {
          setAccounts(data.accounts);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [user]);

  // Add a new account
  const addAccount = async (newAccount: NewAccount) => {
    setDialogLoading(true);

    try {
      if (!user) {
        toast.error("User not found");
        return;
      }

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user,
          account_name: newAccount.accountName,
          account_type: newAccount.accountType,
          balance: newAccount.balance,
          cardno: newAccount.cardNumber,
          card_company: newAccount.cardCompany || "Other",
          isVerified: false,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const updatedAccountsResponse = await fetch(`/api/accounts?user_id=${user}`);
        const updatedAccountsData = await updatedAccountsResponse.json();
        if (updatedAccountsData.success) {
          setAccounts(updatedAccountsData.accounts);
          toast.success("Account successfully added");
        }
      } else {
        toast.error("Failed to add account. Please try again.");
      }
    } catch (error) {
      console.error("Error adding account:", error);
      toast.error("Failed to add account. Please try again.");
    } finally {
      setDialogLoading(false);
      setShowDialog(false);
    }
  };

  // Update an existing account
  const updateAccount = async (updatedAccount: Partial<Account> & { account_id: string }) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account_id: updatedAccount.account_id,
          account_name: updatedAccount.account_name,
          account_type: updatedAccount.account_type,
          balance: updatedAccount.balance,
          cardno: updatedAccount.cardno,
          card_company: updatedAccount.card_company
        })
      });

      const data = await response.json();

      if (data.success) {
        setAccounts(currentAccounts => 
          currentAccounts.map(account => 
            account.account_id === updatedAccount.account_id 
              ? { ...account, ...updatedAccount } 
              : account
          )
        );
        toast.success("Account successfully modified");
      } else {
        toast.error("Failed to update the account.");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Failed to update the account.");
    }
  };

  // Delete an account
  const deleteAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ account_id: accountId }),
      });

      const data = await response.json();

      if (data.success) {
        setAccounts(currentAccounts => 
          currentAccounts.filter(account => account.account_id !== accountId)
        );
        toast.success('Account successfully deleted');
      } else {
        toast.error('Failed to delete the account.');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error('Failed to delete the account.');
    }
  };

  const contextValue = {
    accounts,
    loading,
    dialogLoading,
    showDialog,
    setShowDialog,
    addAccount,
    updateAccount,
    deleteAccount
  };

  return (
    <AccountsContext.Provider value={contextValue}>
      {children}
    </AccountsContext.Provider>
  );
};