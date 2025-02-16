import { Resend } from 'resend';
import EmailTemplate from './EmailTemplate';
import { supabase } from '@/app/utils/supabase/client'

interface VerificationResponse {
    success: boolean;
    message: string;
    error?: string;
  }




  export const sendOtp = async (email: string): Promise<VerificationResponse> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) {
        return {
          success: false,
          message: "Failed to send OTP",
          error: error.message
        };
      }
      return {
        success: true,
        message: "OTP sent successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to send OTP",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  };
  


  export const verifyOtp = async ({ email, token }: { email: string; token: string; }): Promise<VerificationResponse> => 
{
    try {
        const { error } = await supabase.auth.verifyOtp({ email, token: token , type: 'email'});
        if (error) {
          return {
            success: false,
            message: "Failed to verify OTP",
            error: error.message
          };
        }
        return {
          success: true,
          message: "OTP verified successfully"
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to verify OTP",
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
 }















// const resend = new Resend('');

// export async function verify(email: string) {
//   try {
//     const response = await resend.emails.send({
//       from: 'fundshaven@noreply.org',
//       to: email,
//       subject: 'Your OTP Code',
//       react: EmailTemplate(),
//     });

//     return response;
//   } catch (error) {
//     console.error('Error sending verification email:', error);
//     throw error;
//   }
// }