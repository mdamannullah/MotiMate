import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context from user profile
    const educationContext = userProfile ? `
Student Profile:
- Education Level: ${userProfile.education_level || 'Not specified'}
- University: ${userProfile.university || 'Not specified'}
- Course: ${userProfile.course || 'Not specified'}
- Semester: ${userProfile.semester || 'Not specified'}
- Subjects: ${userProfile.subjects?.join(', ') || 'Not specified'}
- Board/Regulation: ${userProfile.board || userProfile.regulation || 'Not specified'}
` : '';

    const systemPrompt = `You are MotiMate AI, a friendly and knowledgeable academic tutor. Your role is to help students understand concepts, solve problems, and prepare for exams.

${educationContext}

Guidelines:
1. Tailor your explanations to the student's education level and curriculum
2. Use clear, simple language with examples
3. Break down complex concepts into digestible parts
4. Use markdown formatting for better readability (bold, bullet points, formulas)
5. For math/science, show step-by-step solutions
6. Be encouraging and supportive
7. If asked about topics outside academics, politely redirect to study-related help
8. Keep responses concise but thorough
9. Use formulas and equations when relevant (e.g., F = ma, E = mc²)
10. Suggest related topics the student might want to explore`;

    console.log("Calling Lovable AI for tutor response...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response back
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("AI Tutor error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
