import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { transactions } from '@/app/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const { accountId } = params;

    // Get transaction count for this account
    const result = await db
      .select({ count: transactions.transaction_id })
      .from(transactions)
      .where(and(
        eq(transactions.user_id, session.user.id),
        eq(transactions.account_id, accountId),
        isNull(transactions.deleted_at)
      ));

    const count = result.length;

    return NextResponse.json({ 
      success: true, 
      count 
    });

  } catch (error) {
    console.error('Error fetching transaction count:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch transaction count' 
    }, { status: 500 });
  }
} 