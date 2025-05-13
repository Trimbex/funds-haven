import { NextRequest, NextResponse } from 'next/server';
import { deleteTransaction, getTransactions } from '@/app/server/transactions/transactions';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = params.transactionId;
    const body = await req.json();
    const { user_id, cascade } = body;

    if (!user_id || !transactionId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: user_id and transaction_id' },
        { status: 400 }
      );
    }

    const result = await deleteTransaction(transactionId, user_id, { cascade });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete transaction',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 