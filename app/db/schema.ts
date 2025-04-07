import * as t from 'drizzle-orm/pg-core';

const timestamps = {
  updated_at: t.timestamp(),
  created_at: t.timestamp().defaultNow().notNull(),
  deleted_at: t.timestamp(),
};

export const users = t.pgTable('users', {
  id: t.uuid('id').primaryKey().notNull(),
  plaid_id: t.text('plaid_id'),
  firstName: t.text('first_name'),
  lastName: t.text('last_name'),
  email: t.varchar('email').notNull().unique(),
  // phone: t.text('phone'),
  updated_at: timestamps.updated_at,
  created_at: timestamps.created_at,
});

export const accounts = t.pgTable('accounts', {
  account_id: t.uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: t.uuid('user_id').notNull().references(() => users.id),
  account_name: t.text('account_name'),
  account_type: t.text('account_type'),
  balance: t.numeric('balance', { precision: 10, scale: 2 }).default('0.00'), 
  cardno: t.text('cardno'),
  card_company: t.text('card_company').default('Other'),
  isVerified: t.boolean('isVerified').default(false),
  updated_at: timestamps.updated_at,
  created_at: timestamps.created_at,
});


export const categories = t.pgTable('categories',{
  category_id: t.uuid('id').primaryKey().defaultRandom().notNull(),
  category_name: t.text('category_name').notNull(),
  category_description: t.text('category_description'),
  tags: t.json('tags'),
  budget: t.numeric('budget', { precision: 10, scale: 2 }).default('0.00'),
  spent: t.numeric('spent', { precision: 10, scale: 2 }).default('0.00'),
  color: t.text('color').default('gray'),
  predefined: t.boolean('predefined').default(true),
  image: t.text('image'),
  user_id: t.uuid('user_id').notNull().references(() => users.id),
  recurring: t.boolean('recurring').default(false),
 
})

export const transactions = t.pgTable('transactions', {
  transaction_id: t.uuid('id').primaryKey().defaultRandom().notNull(),
  user_id: t.uuid('user_id').notNull().references(() => users.id),
  account_id: t.uuid('account_id').references(() => accounts.account_id),
  // Replace category_id with categories JSON field
  categories: t.json('categories').default([]), // Will store array of {id: string|null, name: string} objects
  amount: t.numeric('amount', { precision: 10, scale: 2 }).notNull(),
  description: t.text('description'),
  transaction_date: t.timestamp('transaction_date').defaultNow().notNull(),
  transaction_type: t.text('transaction_type').notNull(), // 'income' or 'expense'
  payment_method: t.text('payment_method'), // e.g., 'cash', 'credit', 'debit'
  status: t.text('status').default('completed'), // 'completed', 'pending', 'failed'
  recurring: t.boolean('recurring').default(false),
  updated_at: timestamps.updated_at,
  created_at: timestamps.created_at,
  deleted_at: timestamps.deleted_at,
});














// // Similarly update the transactions table
// export const transactions = t.pgTable('transactions', {
//   transaction_id: t.uuid('id').primaryKey().notNull(),
//   account_id: t.uuid('account_id').notNull().references(() => accounts.account_id),
//   transaction_type: t.text('transaction_type'),
//   amount: t.numeric('amount', { precision: 10, scale: 2 }), // Add precision and scale here too
//   description: t.text('description'),
//   date: t.timestamp('date'),
//   created_at: timestamps.created_at,
// });

// export const categories = t.pgTable('categories', {
//   category_id: t.uuid('id').primaryKey().notNull(),
//   name: t.text('name').notNull().unique(),
//   description: t.text('description'),
//   created_at: timestamps.created_at,
// });

// export const transaction_categories = t.pgTable('transaction_categories', {
//   transaction_id: t.uuid('transaction_id').notNull().references(() => transactions.transaction_id),
//   category_id: t.uuid('category_id').notNull().references(() => categories.category_id),
// });



// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   fullName: text('full_name'),
//   phone: varchar('phone', { length: 256 }),
// });


// export const accountTable = pgTable("accounts", {
//     user_id: uuid("user_id").notNull().references(() => "auth.users.id"),  // Correct foreign key reference
//     account_id: serial("account_id").primaryKey(),                        // Auto-generated account ID
//     account_name: varchar("account_name", { length: 255 }).notNull(),      // Name of the account
//     account_type: varchar("account_type", { length: 100 }).notNull(),      // Type of account (e.g., savings, checking)
//     balance: numeric("balance", { precision: 10, scale: 2 }).notNull(),    // Balance in the account
//     cardno: varchar("cardno", { length: 16 }).notNull(),                  // Card number (e.g., 16-digit number)
//     verified: boolean("verified").default(false),                         // Verification status (default is false)
//   });