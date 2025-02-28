import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCurrentUserID } from '@/app/api/general';
import { toast } from "sonner"

// EditAccountDialog Component
interface EditAccountDialogProps {
  accountID: string;
  accountName: string;
  accountType: string;
  balance: string;
  cardno: string;
  onSave: (updatedAccount: { accountName: string; accountType: string; balance: string; cardno: string }) => void;
}

const EditAccountDialog = ({ accountID, accountName, accountType, balance, cardno, onSave }: EditAccountDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [editedAccountName, setEditedAccountName] = React.useState(accountName);
  const [editedAccountType, setEditedAccountType] = React.useState(accountType);
  const [editedBalance, setEditedBalance] = React.useState<string>(balance);
  const [editedCardNo, setEditedCardNo] = React.useState(cardno);


  const handleSave = async () => 
  {
    onSave({
      accountName: editedAccountName,
      accountType: editedAccountType,
      balance: editedBalance,
      cardno: editedCardNo,
    });

    try
    {
        if(!accountID)
        {
          toast.error("Account ID is required");
          return;
        }

        const response = await fetch('/api/accounts',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              account_id: accountID,
              account_name: editedAccountName,
              account_type: editedAccountType,
              balance: editedBalance,
              cardno: editedCardNo
            })
          }
        );

        const data = await response.json();

        if(data.success)
        {
          toast.success("Account successfully modified");
          //setTimeout(() => { window.location.reload(); }, 2000);
        }
        else
        {
          toast.error("Failed to update the account.");
        }

    }
    catch(error)
    {
        toast.error("Failed to update the account.");
    }

  }

  const handleDelete = async () =>
  {
    if(!accountID)
      {
        toast.error("Account ID is required");
        return;
      }

     const response = await fetch('/api/accounts',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account_id: accountID
        })
      }

     )

      const data = await response.json();

      if(data.success)
      {
        toast.success("Account successfully deleted");
        //setTimeout(() => { window.location.reload(); }, 2000);
      }
      else
      {
        toast.error("Failed to delete the account.");
      }

  }

  // const handleSave = async () => {
  //   onSave({
  //     accountName: editedAccountName,
  //     accountType: editedAccountType,
  //     balance: editedBalance,
  //     cardno: editedCardNo,
  //   });

  //   try {
  //     const response = await editAccount(accountID, editedAccountName, editedAccountType, editedBalance, editedCardNo);
  //     if (response?.success) {
  //       toast.success("Account successfully modified") // Use sonner's toast

  //       // Wait 2 seconds before refreshing the page
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000);
  //     }
  //   } catch {
  //     toast.error("Failed to update the account."); // Use sonner's toast
  //   } finally {
  //     setIsOpen(false);
  //   }
  // };


  // const handleDelete = async () => {
  //   try {
  //       const response = await deleteAccount(accountID);
  //       if (response?.success) {
  //           toast.success("Account successfully deleted") 
    
            
  //           setTimeout(() => {
  //           window.location.reload();
  //           }, 2000);
  //       }
  //       } catch {
  //           toast.error("Failed to delete the account."); 
  //       }
  //   setIsOpen(false);
  //   }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Pencil className="mr-1" /> Edit Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogDescription>Make changes to your account here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input id="accountName" value={editedAccountName} onChange={(e) => setEditedAccountName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Input id="accountType" value={editedAccountType} onChange={(e) => setEditedAccountType(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input id="balance" type="number" value={editedBalance} onChange={(e) => setEditedBalance(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cardno">Card Number</Label>
            <Input id="cardno" value={editedCardNo} onChange={(e) => setEditedCardNo(e.target.value)} placeholder="Last 4 digits" />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="destructive" onClick={() => handleDelete()}>
            <Trash2 /> Delete Account
          </Button>
          <div>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="ml-6">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;