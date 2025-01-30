export const AccountSchema = {
    name: 'accounts',
    fields: {
      id: 'uuid',
      user_id: 'uuid',
      name: 'varchar',
      plaid_id: 'varchar',
      created_at: 'timestamp with time zone'
    },
    primaryKey: 'id',
    timestamps: true
  }
  
  export type Account = {
    id: string
    user_id: string
    name: string
    plaid_id: string
    created_at: Date
  }