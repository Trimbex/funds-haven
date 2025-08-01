# 💰 Funds Haven

A modern, comprehensive personal finance management application built with Next.js, designed to help users track expenses, manage budgets, and gain insights into their financial habits.

![Funds Haven Dashboard](./public/logo.svg)

## ✨ Features

### 🔐 Authentication & Security
- **Multiple Authentication Methods**: Google OAuth, Magic Link Email, and Credentials
- **Secure Session Management**: JWT-based sessions with NextAuth.js
- **Email Verification**: Beautiful email templates for magic link authentication
- **User Profile Management**: Complete profile settings with theme preferences

### 💳 Account Management
- **Multiple Account Support**: Add and manage various bank accounts and credit cards
- **Account Verification**: Verify accounts for enhanced security
- **Real-time Balance Tracking**: Monitor account balances across all your accounts
- **Card Company Integration**: Support for major card companies

### 📊 Transaction Management
- **Smart Transaction Tracking**: Comprehensive income and expense tracking
- **Category-based Organization**: Flexible category system with custom colors and icons
- **Recurring Transactions**: Automated recurring transaction generation
- **Payment Method Tracking**: Track cash, credit, debit, and other payment methods
- **Transaction Search & Filtering**: Advanced filtering and search capabilities

### 📈 Analytics & Insights
- **Interactive Charts**: Beautiful visualizations with Chart.js and Recharts
- **Spending Analytics**: Detailed breakdowns of spending patterns
- **Budget vs. Actual**: Track budget performance across categories
- **Category Pie Charts**: Visual representation of spending distribution
- **Monthly/Yearly Trends**: Long-term financial trend analysis

### 🎯 Budget Management
- **Category Budgets**: Set and track budgets for each spending category
- **Budget Alerts**: Notifications when approaching budget limits
- **Visual Progress Indicators**: Real-time budget progress visualization
- **Overspending Alerts**: Automatic notifications for budget overruns

### 🔔 Smart Notifications
- **Customizable Alerts**: Personalized notification preferences
- **Budget Threshold Alerts**: Configurable budget warning thresholds
- **Security Notifications**: Important account security updates
- **Feature Updates**: Stay informed about new features

### 🎨 Modern UI/UX
- **Dark/Light Theme**: System-aware theme switching
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Components**: Built with shadcn/ui and Radix UI
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Accessibility**: WCAG compliant interface design

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS-in-JS (Styled Components)
- **UI Components**: shadcn/ui + Radix UI
- **Charts**: Chart.js + Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React + React Icons

### Backend & Database
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Database Host**: Supabase
- **Authentication**: NextAuth.js with Drizzle Adapter
- **Email Service**: Resend
- **Runtime**: Bun

### State Management & Data Fetching
- **Client State**: React Context + Hooks
- **Data Tables**: TanStack Table
- **Form Handling**: React Hook Form (implied)
- **Date Handling**: date-fns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (or Supabase account)
- Google OAuth credentials (optional)
- Resend API key (optional, for email features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/funds-haven.git
   cd funds-haven
   ```

2. **Install dependencies**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/funds_haven"
   
   # Supabase (if using Supabase)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email Service (optional)
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

4. **Database Setup**
   ```bash
   # Generate database schema
   bun run db:generate
   
   # Run database migrations
   bun run db:migrate
   
   # Or push schema directly (development)
   bun run db:push
   ```

5. **Start Development Server**
   ```bash
   bun run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
funds-haven/
├── app/                          # Next.js App Router
│   ├── (authentication)/         # Auth routes (login, register)
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── accounts/             # Account management
│   │   ├── categories/           # Category management
│   │   ├── dashboard/            # Main dashboard
│   │   ├── transactions/         # Transaction management
│   │   └── settings/             # User settings
│   ├── api/                      # API routes
│   ├── components/               # Shared components
│   ├── context/                  # React contexts
│   ├── db/                       # Database configuration
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   ├── server/                   # Server-side logic
│   └── utils/                    # Utility functions
├── components/                   # Shared UI components
├── lib/                          # Global utilities
├── public/                       # Static assets
└── styles/                       # Global styles
```

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: User profiles and authentication data
- **Accounts**: Bank accounts and credit cards
- **Categories**: Spending/income categories with budgets
- **Transactions**: Financial transactions with categorization
- **Recurrence Settings**: Automated recurring transaction rules
- **Notifications**: User notifications and alerts
- **User Settings**: Notification preferences and settings

## 🔧 Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Database
bun run db:generate      # Generate database migrations
bun run db:migrate       # Run database migrations
bun run db:push          # Push schema changes to database
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `bun run build`
2. Start the production server: `bun run start`
3. Ensure environment variables are set in production

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### Accounts
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/[accountId]/transactions/count` - Get transaction count

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create new category

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/[transactionId]` - Update transaction

### Dashboard
- `GET /api/dashboard/analytics` - Get dashboard analytics data

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/[notificationId]` - Mark notification as read

## 🎨 Theming

The application supports both light and dark themes with:
- System preference detection
- Manual theme switching
- Consistent color schemes across all components
- Accessible contrast ratios

## 🔒 Security Features

- **Data Encryption**: Passwords are hashed using bcryptjs
- **Session Security**: Secure JWT tokens with configurable expiration
- **CORS Protection**: Configured for production environments
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

## 📊 Charts & Analytics

The application includes various chart types:
- **Pie Charts**: Category distribution visualization
- **Bar Charts**: Budget vs. actual spending
- **Line Charts**: Spending trends over time
- **Interactive Charts**: Hover effects and drill-down capabilities

## 🐛 Known Issues & Limitations

- Email verification requires Resend API key setup
- Google OAuth requires proper domain configuration
- Some features may require additional environment variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework used
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [shadcn/ui](https://ui.shadcn.com/) - For UI components
- [Drizzle ORM](https://orm.drizzle.team/) - For database management
- [NextAuth.js](https://next-auth.js.org/) - For authentication
- [Supabase](https://supabase.com/) - For database hosting

---

**Funds Haven** - Take control of your financial future! 💪💰
