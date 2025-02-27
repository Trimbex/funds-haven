import { NextResponse } from 'next/server';
import { getAccounts, addAccount, editAccount, deleteAccount } from '@/app/server/accounts/accounts';

// GET: Fetch accounts for a specific user
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ success: false, message: 'user_id is required' }, { status: 400 });
  }

  try {
    const accounts = await getAccounts(userId);
    return NextResponse.json({ success: true, accounts });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json({ success: false, message: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST: Add a new account
export async function POST(request: Request) {
  try {
    const { user_id, account_name, account_type, balance, cardno, isVerified } = await request.json();

    if (!user_id || !account_name || !account_type || !balance || !cardno) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await addAccount(user_id, account_name, account_type, balance, cardno, isVerified || false);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding account:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to add account' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing account
export async function PUT(request: Request) {
  try {
    const { account_id, account_name, account_type, balance, cardno, isVerified } = await request.json();

    if (!account_id || !account_name || !account_type || !balance || !cardno) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await editAccount(account_id, account_name, account_type, balance, cardno, isVerified || false);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating account:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to update account' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an account
export async function DELETE(request: Request) {
  try {
    const { account_id } = await request.json();

    if (!account_id) {
      return NextResponse.json(
        { success: false, message: 'account_id is required' },
        { status: 400 }
      );
    }

    const result = await deleteAccount(account_id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete account' },
      { status: 500 }
    );
  }
}