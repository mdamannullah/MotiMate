import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store OTPs in memory (for demo - in production use database)
const otpStore = new Map<string, { otp: string; expires: number }>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, type = 'signup' } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email, { otp, expires });

    // Log OTP for testing (in production, send via email)
    console.log(`OTP for ${email}: ${otp}`);

    // Use LOVABLE_API_KEY for sending email via Lovable AI (mock for now)
    // In production, integrate with Resend or similar service
    
    const subject = type === 'signup' 
      ? 'Welcome to MotiMate - Verify Your Email' 
      : type === 'delete' 
        ? 'MotiMate - Account Deletion Verification'
        : 'MotiMate - Password Reset Verification';

    const htmlContent = `
      <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e07356 0%, #eb9a7a 100%); padding: 30px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 MotiMate</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 8px;">Your AI Study Companion</p>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 16px 16px;">
          <h2 style="color: #333; margin-top: 0;">Hello${name ? ` ${name}` : ''}! 👋</h2>
          <p style="color: #666; line-height: 1.6;">
            ${type === 'signup' 
              ? 'Thank you for signing up for MotiMate! Please verify your email address using the code below:' 
              : type === 'delete'
                ? 'You have requested to delete your account. Please use the verification code below to confirm:'
                : 'You have requested to reset your password. Please use the verification code below:'}
          </p>
          <div style="background: #f8f4f2; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <p style="color: #999; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
            <div style="font-size: 36px; font-weight: bold; color: #e07356; letter-spacing: 8px;">${otp}</div>
            <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">Valid for 10 minutes</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            © 2024 MotiMate. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // For now, return success with the OTP (for testing)
    // In production, integrate with Resend to actually send the email
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP sent successfully",
        // Remove this in production - only for testing
        debug_otp: otp 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
