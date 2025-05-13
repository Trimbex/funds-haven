import { NextRequest, NextResponse } from 'next/server';
import { checkAndGenerateRecurringTransactions } from '@/app/server/cron/autoGenerateTransactions';

// This endpoint can be called by a cron job service (like Vercel Cron Jobs)
// or manually triggered for testing
export async function GET(request: NextRequest) {
  try {
    // Check for a secret key to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CRON_SECRET;
    
    if (secret && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== secret)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const result = await checkAndGenerateRecurringTransactions();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to run automatic transaction generation',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 