import { NextResponse } from 'next/server';
import { createRecurrenceSettings, getRecurrenceSettings } from '@/app/server/transactions/recurrence';
import { addTransaction, CreateTransactionInput } from '@/app/server/transactions/transactions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      transaction_id,
      frequency,
      interval,
      start_date,
      end_date
    } = body;

    if (!user_id || !transaction_id || !frequency) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: user_id, transaction_id, and frequency are required' 
      }, { status: 400 });
    }

    const result = await createRecurrenceSettings(user_id, transaction_id, {
      frequency,
      interval: interval || 1,
      start_date: start_date ? new Date(start_date) : new Date(),
      end_date: end_date ? new Date(end_date) : undefined
    });

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("Error creating recurrence:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create recurrence settings' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const recurrenceId = url.searchParams.get('recurrence_id');
  const userId = url.searchParams.get('user_id');

  if (!recurrenceId || !userId) {
    return NextResponse.json({ 
      success: false, 
      message: 'recurrence_id and user_id are required' 
    }, { status: 400 });
  }

  try {
    const result = await getRecurrenceSettings(recurrenceId, userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching recurrence settings:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch recurrence settings' 
    }, { status: 500 });
  }
}

// Generate recurring transactions based on recurrence settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      transaction_template,
      recurrence_id,
      generate_until
    } = body;

    console.log('Generating recurrence instances:', {
      recurrence_id,
      user_id,
      until: generate_until,
      template: JSON.stringify(transaction_template)
    });

    if (!user_id || !transaction_template || !recurrence_id) {
      console.error('Missing required fields:', { user_id, transaction_template, recurrence_id });
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: user_id, transaction_template, and recurrence_id are required' 
      }, { status: 400 });
    }

    // Get recurrence settings
    const recurrenceResult = await getRecurrenceSettings(recurrence_id, user_id);
    if (!recurrenceResult.success || !recurrenceResult.settings) {
      console.error('Failed to get recurrence settings:', recurrenceResult);
      return NextResponse.json(recurrenceResult, { status: 400 });
    }

    const settings = recurrenceResult.settings;
    console.log('Recurrence settings found:', settings);
    
    const generateUntilDate = generate_until ? new Date(generate_until) : 
                             (settings.end_date ? new Date(settings.end_date) : 
                             new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now by default

    // Generate transactions based on recurrence pattern
    const generatedTransactions = [];
    // Ensure we have a valid date object for start date
    const startDate = settings.start_date ? new Date(settings.start_date) : new Date();
    let currentDate = new Date(startDate);
    
    console.log('Starting generation from:', currentDate, 'until:', generateUntilDate);
    let count = 0;
    const MAX_TRANSACTIONS = 50; // Safety limit
    
    // Determine if the template is a parent transaction
    const isParentTransaction = !transaction_template.parent_transaction_id;
    // Use the correct parent ID - either the template ID if it's a parent, or its parent ID if it's already a child
    const parentTransactionId = isParentTransaction ? transaction_template.transaction_id : transaction_template.parent_transaction_id;
    
    console.log(`Template is ${isParentTransaction ? 'a parent' : 'a child'} transaction. Parent ID: ${parentTransactionId}`);
    
    // Ensure the transaction date is a proper Date object
    const templateDate = new Date(transaction_template.transaction_date);
    console.log(`Template transaction date: ${templateDate.toISOString()}`);
    
    while (currentDate <= generateUntilDate && count < MAX_TRANSACTIONS) {
      count++;
      // Skip the first date if it matches the template's date (since original transaction exists)
      console.log(`Comparing dates: current=${currentDate.toISOString()}, template=${templateDate.toISOString()}`);
      
      // Compare dates by their day, month, and year to avoid time issues
      const isSameDate = 
        currentDate.getFullYear() === templateDate.getFullYear() &&
        currentDate.getMonth() === templateDate.getMonth() &&
        currentDate.getDate() === templateDate.getDate();
      
      if (!isSameDate) {
        console.log(`Creating transaction for date: ${currentDate.toISOString()}`);
        
        // Create a new transaction object with correct typing
        const newTransaction: Partial<CreateTransactionInput> = {
          description: transaction_template.description,
          amount: transaction_template.amount,
          transaction_date: new Date(currentDate), // Ensure it's a Date object, not a string
          transaction_type: transaction_template.transaction_type,
          categories: transaction_template.categories,
          status: transaction_template.status,
          recurrence_id: recurrence_id,
          parent_transaction_id: parentTransactionId
        };
        
        // Only add account_id if it's a valid UUID (not 'Cash' or other string)
        if (transaction_template.account_id && 
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transaction_template.account_id)) {
          newTransaction.account_id = transaction_template.account_id;
        }
        
        console.log('Transaction to create:', newTransaction);
        
        try {
          const result = await addTransaction(user_id, newTransaction as Omit<CreateTransactionInput, 'user_id'>);
          console.log('Transaction creation result:', result.success);
          if (result.success) {
            generatedTransactions.push(result.transaction);
          } else {
            console.error('Failed to create transaction:', result.message);
          }
        } catch (err) {
          console.error('Error creating individual transaction:', err);
        }
      } else {
        console.log('Skipping original transaction date');
      }
      
      // Move to next occurrence based on frequency
      const oldDate = new Date(currentDate);
      const interval = settings.interval ?? 1; // Default to 1 if interval is null
      
      switch (settings.frequency) {
        case 'weekly':
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + (7 * interval)));
          break;
        case 'monthly':
          currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + interval));
          break;
        case 'yearly':
          currentDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + interval));
          break;
        default:
          // Default to weekly if frequency is unknown
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
      }
      console.log(`Advanced date from ${oldDate.toISOString()} to ${currentDate.toISOString()} (${settings.frequency})`);
    }

    console.log(`Generated ${generatedTransactions.length} transactions`);
    return NextResponse.json({ 
      success: true, 
      message: `Generated ${generatedTransactions.length} recurring transactions`,
      transactions: generatedTransactions
    });
  } catch (error) {
    console.error("Error generating recurring transactions:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to generate recurring transactions',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 