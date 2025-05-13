# Recurring Transactions System

This document explains how the recurring transactions system works and how to set up automatic generation of recurring transactions.

## How It Works

### Transaction Structure

- **Parent Transaction**: The original transaction with a `recurrence_id`. The `parent_transaction_id` is NULL.
- **Instance Transactions**: Generated occurrences of the parent transaction. These have both a `recurrence_id` and a `parent_transaction_id` pointing to the parent.

### Recurrence Settings

Recurrence settings are stored in the `recurrence_settings` table with the following properties:
- `frequency`: 'weekly', 'monthly', or 'yearly'
- `interval`: How many units between occurrences (e.g., 2 for bi-weekly)
- `start_date`: When the recurrence begins
- `end_date`: Optional end date for the recurrence

## Automatic Transaction Generation

There are two ways to generate recurring transactions:

1. **Manual Generation**: Users can click the "Generate Instances" button in the transactions table to manually generate future instances.

2. **Automatic Generation**: The system can automatically check for and generate upcoming transactions using a scheduled job.

## Setting Up Automatic Generation

### Option 1: Vercel Cron Jobs (Recommended for Vercel deployments)

If you're hosting your application on Vercel, you can use Vercel Cron Jobs:

1. Add the following to your `vercel.json` file:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-transactions",
      "schedule": "0 0 * * *"
    }
  ]
}
```

This will run the generation job every day at midnight.

### Option 2: External Cron Service

You can use an external service like cron-job.org, EasyCron, or GitHub Actions:

1. Set up an account with the service
2. Create a new cron job with the following URL:
   ```
   https://your-domain.com/api/cron/generate-transactions
   ```
3. Set the cron schedule (e.g., `0 0 * * *` for daily at midnight)
4. If you've set up a CRON_SECRET in your environment variables, add an Authorization header:
   ```
   Authorization: Bearer your-secret-key
   ```

### Option 3: Local Development Testing

To test automatic generation during development:

1. Visit `/api/cron/generate-transactions` in your browser
2. Check the console logs to see the generation results

## Security Considerations

The automatic generation endpoint is protected by an optional secret key. To enable this protection:

1. Add `CRON_SECRET=your-random-secure-string` to your environment variables
2. Include this secret in the Authorization header when calling the endpoint

## Troubleshooting

If transactions are not being generated automatically:

1. Check that your cron job is running (view logs in your cron service)
2. Verify that recurrence settings exist in the database
3. Ensure parent transactions have the correct `recurrence_id` and NULL `parent_transaction_id`
4. Check the server logs for any errors during generation

## Testing the System

You can manually trigger the generation process by:

1. Creating a recurring transaction 
2. Visiting `/api/cron/generate-transactions` in your browser
3. Refreshing the transactions page to see the newly generated instances 