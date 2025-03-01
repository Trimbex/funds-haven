import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CardDropdown from '@/components/ui/payment-dropbox';
import { useAccounts } from '@/app/context/accountContext';

// EditAccountDialog Component
interface EditAccountDialogProps {
  account: {
    account_id: string;
    account_name: string;
    account_type: string;
    balance: number | string;
    cardno: string;
    card_company: string;
  };
}

const EditAccountDialog = ({ account }: EditAccountDialogProps) => {
  const { updateAccount, deleteAccount } = useAccounts();
  const [isOpen, setIsOpen] = React.useState(false);
  const [editedAccountName, setEditedAccountName] = React.useState(account.account_name);
  const [editedAccountType, setEditedAccountType] = React.useState(account.account_type);
  const [editedBalance, setEditedBalance] = React.useState<string>(
    typeof account.balance === 'number' ? account.balance.toString() : account.balance
  );
  const [editedCardNo, setEditedCardNo] = React.useState(account.cardno);
  const [selectedCard, setSelectedCard] = React.useState(account.card_company || "Other");

  const handleSave = async () => {
    const updatedAccountData = {
      account_id: account.account_id,
      account_name: editedAccountName,
      account_type: editedAccountType,
      balance: editedBalance,
      cardno: editedCardNo,
      card_company: selectedCard
    };

    await updateAccount(updatedAccountData);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    await deleteAccount(account.account_id);
    setIsOpen(false);
  };

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
          <Label htmlFor="cardCompany">Card Type</Label>
          <CardDropdown 
            initialValue={selectedCard} 
            onSelect={(cardName) => setSelectedCard(cardName)} 
          />
        </div>

        <div className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete}>
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