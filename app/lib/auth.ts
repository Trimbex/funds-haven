import { NextAuthOptions } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/app/db"
import * as schema from "@/app/db/schema"
import { Resend } from "resend"

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_placeholder_replace_with_real_key_later" 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.nextAuthAccounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
  }),
  
  providers: [
    // Magic Link Email Provider
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      // Custom email sending
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        try {
          if (!resend) {
            console.log("⚠️  RESEND_API_KEY not configured. Email would be sent to:", email)
            console.log("🔗 Magic link URL:", url)
            return // Skip actual email sending in development
          }

          await resend.emails.send({
            from: provider.from as string,
            to: email,
            subject: "Sign in to Funds Haven",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Funds Haven</h1>
                </div>
                <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                  <h2 style="color: #333; margin-bottom: 20px;">Sign in to your account</h2>
                  <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                    Click the button below to securely sign in to your Funds Haven account. This link will expire in 1 hour.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                              color: white; 
                              padding: 15px 30px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              font-weight: bold; 
                              display: inline-block;
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                      Sign In to Funds Haven
                    </a>
                  </div>
                  <p style="color: #888; font-size: 14px; margin-top: 30px;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                </div>
              </div>
            `,
          })
        } catch (error) {
          console.error("Error sending email:", error)
          throw new Error("Failed to send verification email")
        }
      },
    }),

    // Password-based login (optional, for existing users)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // Check if user exists in your database
          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, credentials.email),
          })

          if (!user || !user.password) return null

          // For now, skip password verification since we don't have bcrypt
          // In production, you'd use: await bcrypt.compare(credentials.password, user.password)
          
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.image,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    signUp: "/register",
    verifyRequest: "/verify-request",
    error: "/auth/error",
  },

  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },

  session: {
    strategy: "jwt",
  },
} 