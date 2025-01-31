import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supaBaseClient'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server' 

export async function GET(request: NextRequest) {
  try {
    // You can check for authentication here (if needed)
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetching all accounts from the 'accounts' table
    const { data, error } = await supabase.from('accounts').select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Extract data from the request body
    const { user_id, name, plaid_id }: { user_id: string; name: string; plaid_id: string } = body

    // Validate the request body
    if (!user_id || !name || !plaid_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // You can check for authentication here (if needed)
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Inserting new account into the 'accounts' table
    const { data, error } = await supabase
      .from('accounts')
      .insert([
        {
          user_id,
          name,
          plaid_id,
        }
      ])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
