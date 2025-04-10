import { NextResponse } from 'next/server';
import { getTransactions,addTransaction,editTransaction,deleteTransaction } from '@/app/server/transactions/transactions';


export async function GET(request: Request) {

    const url = new URL(request.url);
    const userId = url.searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'user_id is required' }, { status: 400 });
    }

    try {
      const transactions = await getTransactions(userId);
      return NextResponse.json({ success: true, transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: 500 });
    }
  }

  export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            user_id,
            account_id,
            transaction_type,
            amount,
            description,
            transaction_date,
            payment_method,
            status,
            recurring,
            categories
        } = body;

        if (!user_id || !transaction_type || !amount) {
            return NextResponse.json({ success: false, message: 'Missing required fields: user_id, transaction_type, and amount are required' }, { status: 400 });
        }

        const result = await addTransaction(user_id, {
            account_id,
            transaction_type,
            amount,
            description,
            transaction_date,
            payment_method,
            status,
            recurring,
            categories
        });

        return NextResponse.json(result, { status: result.success ? 201 : 400 });
    } catch (error) {
        console.error("Error adding transaction:", error);
        return NextResponse.json({ success: false, message: 'Failed to add transaction' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
      const body = await request.json();
      const {
        transaction_id,
        user_id,
        account_id,
        transaction_type,
        amount,
        description,
        transaction_date,
        payment_method,
        status,
        recurring,
        categories
      } = body;
  
      if (!transaction_id || !user_id) {
        return NextResponse.json({ success: false, message: 'transaction_id and user_id are required' }, { status: 400 });
      }
  
      const result = await editTransaction(transaction_id, user_id, {
        account_id,
        transaction_type,
        amount,
        description,
        transaction_date,
        payment_method,
        status,
        recurring,
        categories
      });
  
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error) {
      console.error("Error updating transaction:", error);
      return NextResponse.json({ success: false, message: 'Failed to update transaction' }, { status: 500 });
    }
  }
  
  export async function DELETE(request: Request) {
    try {
      const body = await request.json();
      const { transaction_id, user_id } = body;
  
      if (!transaction_id || !user_id) {
        return NextResponse.json({ success: false, message: 'transaction_id and user_id are required' }, { status: 400 });
      }
  
      const result = await deleteTransaction(transaction_id, user_id);
      
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return NextResponse.json({ success: false, message: 'Failed to delete transaction' }, { status: 500 });
    }
  }




