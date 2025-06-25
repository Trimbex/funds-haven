import { NextResponse } from 'next/server';
import { getDashboardAnalytics } from '@/app/server/dashboard/analytics';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  const timeFrame = url.searchParams.get('timeFrame') || '6m';

  if (!userId) {
    return NextResponse.json({ 
      success: false, 
      message: 'user_id is required' 
    }, { status: 400 });
  }

  try {
    const result = await getDashboardAnalytics(userId, timeFrame);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        analytics: result.analytics 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch dashboard analytics' 
    }, { status: 500 });
  }
} 