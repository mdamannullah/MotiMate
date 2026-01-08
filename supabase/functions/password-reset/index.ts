import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// PASSWORD RESET EDGE FUNCTION
// ============================================
// Handles: send-otp, verify-otp, reset-password
// Uses secure database storage for OTPs
// ============================================

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Simple hash function for OTP (in production use bcrypt)
async function hashOTP(otp: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(otp + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.slice(0, 16));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Verify OTP hash
async function verifyOTPHash(otp: string, hash: string): Promise<boolean> {
  const computedHash = await hashOTP(otp);
  return computedHash === hash;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { action, email, otp, newPassword } = await req.json();

    // ========== SEND OTP ==========
    if (action === "send") {
      if (!email) {
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user exists
      const { data: userData } = await supabase.auth.admin.listUsers();
      const userExists = userData?.users?.some(u => u.email === email);
      
      if (!userExists) {
        // Don't reveal if email exists - security best practice
        return new Response(
          JSON.stringify({ success: true, message: "If this email exists, an OTP has been sent." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Delete any existing OTPs for this email
      await supabase
        .from("password_reset_otps")
        .delete()
        .eq("email", email);

      // Generate and store new OTP
      const otpCode = generateOTP();
      const otpHash = await hashOTP(otpCode);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      const { error: insertError } = await supabase
        .from("password_reset_otps")
        .insert({
          email,
          otp_hash: otpHash,
          expires_at: expiresAt.toISOString(),
        });

      if (insertError) {
        console.error("Failed to store OTP:", insertError);
        throw new Error("Failed to generate OTP");
      }

      // Log OTP for testing (remove in production)
      console.log(`Password Reset OTP for ${email}: ${otpCode}`);

      // TODO: Integrate with Resend to send actual email
      // For now, return OTP in debug mode
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP sent successfully",
          debug_otp: otpCode // Remove in production
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========== VERIFY OTP ==========
    if (action === "verify") {
      if (!email || !otp) {
        return new Response(
          JSON.stringify({ error: "Email and OTP are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get stored OTP
      const { data: otpData, error: fetchError } = await supabase
        .from("password_reset_otps")
        .select("*")
        .eq("email", email)
        .eq("used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        return new Response(
          JSON.stringify({ error: "No valid OTP found. Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check expiration
      if (new Date(otpData.expires_at) < new Date()) {
        await supabase
          .from("password_reset_otps")
          .delete()
          .eq("id", otpData.id);
        
        return new Response(
          JSON.stringify({ error: "OTP has expired. Please request a new one." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check attempts (max 5)
      if (otpData.attempts >= 5) {
        await supabase
          .from("password_reset_otps")
          .delete()
          .eq("id", otpData.id);
        
        return new Response(
          JSON.stringify({ error: "Too many attempts. Please request a new OTP." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify OTP
      const isValid = await verifyOTPHash(otp, otpData.otp_hash);
      
      if (!isValid) {
        // Increment attempts
        await supabase
          .from("password_reset_otps")
          .update({ attempts: otpData.attempts + 1 })
          .eq("id", otpData.id);
        
        return new Response(
          JSON.stringify({ error: "Invalid OTP. Please try again." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark as verified (but not used yet - will be used when password is reset)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "OTP verified successfully",
          resetToken: otpData.id // Use OTP ID as reset token
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========== RESET PASSWORD ==========
    if (action === "reset") {
      if (!email || !otp || !newPassword) {
        return new Response(
          JSON.stringify({ error: "Email, OTP, and new password are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Validate password strength
      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ error: "Password must be at least 6 characters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Verify OTP again before resetting
      const { data: otpData } = await supabase
        .from("password_reset_otps")
        .select("*")
        .eq("email", email)
        .eq("used", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!otpData || new Date(otpData.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "OTP expired. Please restart the process." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const isValid = await verifyOTPHash(otp, otpData.otp_hash);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get user by email
      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users?.find(u => u.email === email);
      
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (updateError) {
        console.error("Password update failed:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update password" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Mark OTP as used
      await supabase
        .from("password_reset_otps")
        .update({ used: true })
        .eq("id", otpData.id);

      // Create notification for password change
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Password Reset Successful",
        message: "Your password has been reset successfully. If you didn't do this, contact support.",
        type: "password_change"
      });

      return new Response(
        JSON.stringify({ success: true, message: "Password reset successfully" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use: send, verify, or reset" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Password reset error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
