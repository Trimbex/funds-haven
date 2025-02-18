import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, CreditCard, Wallet, Building, CheckCircle2, XCircle } from "lucide-react";

export default function Accounts() {
  // Dummy accounts data
  const accounts = [
    {
      account_id: "uuid-1",
      account_name: "Main Checking",
      account_type: "Checking",
      balance: 5249.52,
      cardno: "****-****-****-1234",
      isVerified: true,
      updated_at: "2024-02-19T10:00:00Z",
    },
    {
      account_id: "uuid-2",
      account_name: "Savings Account",
      account_type: "Savings",
      balance: 12750.33,
      cardno: "****-****-****-5678",
      isVerified: true,
      updated_at: "2024-02-19T09:30:00Z",
    },
    {
      account_id: "uuid-3",
      account_name: "Business Account",
      account_type: "Business",
      balance: 35420.18,
      cardno: "****-****-****-9012",
      isVerified: false,
      updated_at: "2024-02-19T08:45:00Z",
    },
  ];

  const getAccountTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return <Wallet className="w-4 h-4" />;
      case 'savings':
        return <Building className="w-4 h-4" />;
      case 'business':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
        <Button className="bg-[#009dff] hover:bg-[#0081d1]">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#009dff]">
              ${accounts.reduce((sum, account) => sum + Number(account.balance), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {accounts.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Verified Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {accounts.filter(a => a.isVerified).length}/{accounts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardContent className="p-0">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Account Name</TableHead>
                <TableHead className="w-[20%]">Type</TableHead>
                <TableHead className="w-[25%]">Card Number</TableHead>
                <TableHead className="w-[15%] text-right">Balance</TableHead>
                <TableHead className="w-[15%] text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account.account_id}
                  className="transition-colors hover:bg-gray-50 cursor-pointer h-16"
                >
                  <TableCell className="font-medium">{account.account_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAccountTypeIcon(account.account_type)}
                      {account.account_type}
                    </div>
                  </TableCell>
                  <TableCell>{account.cardno}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-center">
                    {account.isVerified ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-yellow-700 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}