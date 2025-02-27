import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';

interface EditAccountDialogProps {
  accountID: string;
  accountName: string;
  accountType: string;
  balance: number;
  onSave: (updatedAccount: { accountName: string; accountType: string; balance: number }) => void;
}

const EditAccountDialog = ({ accountID, accountName, accountType, balance, onSave }: EditAccountDialogProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [editedAccountName, setEditedAccountName] = React.useState(accountName);
  const [editedAccountType, setEditedAccountType] = React.useState(accountType);
  const [editedBalance, setEditedBalance] = React.useState(balance);

  const handleSave = () => {
    onSave({
      accountName: editedAccountName,
      accountType: editedAccountType,
      balance: editedBalance,
    });
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
            <Input
              id="accountName"
              value={editedAccountName}
              onChange={(e) => setEditedAccountName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Input
              id="accountType"
              value={editedAccountType}
              onChange={(e) => setEditedAccountType(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="balance">Balance</Label>
            <Input
              id="balance"
              type="number"
              value={editedBalance}
              onChange={(e) => setEditedBalance(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;