import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// MODULAR AI TUTOR - SELF-CONTAINED BACKEND
// ============================================
// This is a plug-and-play architecture.
// Replace the AIEngine class with any AI provider later.
// ============================================

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UserProfile {
  education_level?: string;
  university?: string;
  course?: string;
  semester?: string;
  subjects?: string[];
  board?: string;
  regulation?: string;
}

// ============================================
// AI ENGINE - PLACEHOLDER (RULE-BASED)
// ============================================
// This class can be swapped with OpenAI, Gemini, etc.
// ============================================

class AIEngine {
  private userProfile: UserProfile | null;

  constructor(userProfile?: UserProfile) {
    this.userProfile = userProfile || null;
  }

  // Knowledge base for rule-based responses
  private knowledgeBase: Record<string, string> = {
    // Physics
    'newton': `**Newton's Laws of Motion** 🍎

1. **First Law (Inertia)**: An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.
   - *Example*: A book on a table stays there until you push it.

2. **Second Law (F = ma)**: Force equals mass times acceleration.
   - *Formula*: F = m × a
   - *Example*: Pushing a heavier cart requires more force.

3. **Third Law (Action-Reaction)**: For every action, there is an equal and opposite reaction.
   - *Example*: When you jump, you push Earth down, and Earth pushes you up.

Would you like me to explain any of these in more detail?`,

    'photosynthesis': `**Photosynthesis** 🌱

Photosynthesis is the process by which plants convert light energy into chemical energy.

**Equation:**
6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂

**Steps:**
1. **Light Reaction** (in thylakoids)
   - Chlorophyll absorbs light
   - Water splits into H⁺, electrons, and O₂
   - ATP and NADPH are produced

2. **Dark Reaction / Calvin Cycle** (in stroma)
   - CO₂ is fixed using ATP and NADPH
   - Glucose (C₆H₁₂O₆) is synthesized

**Key Points:**
- Occurs in chloroplasts
- Chlorophyll is the key pigment
- Light is essential for the process

Shall I explain any step in more detail?`,

    'quadratic': `**Solving Quadratic Equations** 📐

A quadratic equation has the form: **ax² + bx + c = 0**

**Methods to Solve:**

1. **Quadratic Formula** (works always):
   x = (-b ± √(b² - 4ac)) / 2a

2. **Factoring** (when possible):
   - Find two numbers that multiply to 'ac' and add to 'b'
   - Example: x² + 5x + 6 = 0 → (x+2)(x+3) = 0 → x = -2, -3

3. **Completing the Square**:
   - Rearrange to: (x + p)² = q
   - Solve for x

**The Discriminant (b² - 4ac)**:
- If > 0: Two real solutions
- If = 0: One real solution
- If < 0: No real solutions (complex roots)

Would you like a worked example?`,

    'thermodynamics': `**Laws of Thermodynamics** 🔥

1. **Zeroth Law**: If A is in thermal equilibrium with C, and B is with C, then A and B are in equilibrium with each other.

2. **First Law (Energy Conservation)**: 
   ΔU = Q - W
   - Energy cannot be created or destroyed
   - Heat added = internal energy change + work done

3. **Second Law (Entropy)**: 
   - Heat flows from hot to cold naturally
   - Entropy of an isolated system always increases
   - No 100% efficient heat engine exists

4. **Third Law**: 
   - As temperature approaches absolute zero, entropy approaches a minimum
   - Absolute zero (0 K) is unattainable

Need me to explain any law with examples?`,

    'organic': `**Organic Chemistry Basics** ⚗️

**Key Concepts:**

1. **Functional Groups**:
   - Alkanes (-C-C-): Saturated hydrocarbons
   - Alkenes (C=C): Unsaturated with double bond
   - Alkynes (C≡C): Triple bond
   - Alcohols (-OH): Hydroxyl group
   - Aldehydes (-CHO): Carbonyl at end
   - Ketones (>C=O): Carbonyl in middle
   - Carboxylic acids (-COOH): Acidic group

2. **IUPAC Naming**:
   - Find longest carbon chain
   - Number from end nearest substituent
   - Name substituents with position numbers

3. **Isomerism**:
   - Structural isomers: Same formula, different structure
   - Stereoisomers: Same structure, different spatial arrangement

What topic would you like to explore deeper?`,

    'exam': `**Exam Preparation Tips** 📚

**Before the Exam:**
1. Create a study schedule (2-3 weeks before)
2. Review past papers and mark schemes
3. Use active recall - test yourself
4. Make summary notes and flashcards
5. Get enough sleep (7-8 hours)

**Study Techniques:**
- **Pomodoro**: 25 min study, 5 min break
- **Spaced Repetition**: Review at intervals
- **Mind Maps**: Visual connections
- **Teach Others**: Best way to learn

**During the Exam:**
1. Read all questions first
2. Allocate time per question
3. Start with what you know
4. Show all working in calculations
5. Review answers before submitting

**Handling Stress:**
- Deep breathing exercises
- Positive self-talk
- Stay hydrated
- Light exercise before exams

What subject are you preparing for?`,

    'linear': `**Linear Algebra Essentials** 📊

**Key Topics:**

1. **Vectors**:
   - Magnitude: |v| = √(x² + y² + z²)
   - Dot product: a·b = |a||b|cos(θ)
   - Cross product: a×b (perpendicular vector)

2. **Matrices**:
   - Addition: element by element
   - Multiplication: row × column
   - Transpose: Aᵀ (rows ↔ columns)
   - Inverse: A⁻¹ (AA⁻¹ = I)

3. **Determinants**:
   - 2×2: ad - bc
   - Used for finding inverse, solving systems

4. **Eigenvalues & Eigenvectors**:
   - Av = λv
   - det(A - λI) = 0

5. **Systems of Equations**:
   - Gaussian elimination
   - Cramer's rule

Which topic needs more explanation?`,

    'database': `**Database Management Systems** 💾

**Key Concepts:**

1. **DBMS Types**:
   - Relational (SQL): MySQL, PostgreSQL
   - NoSQL: MongoDB, Redis
   - Object-oriented

2. **Normalization**:
   - 1NF: Atomic values
   - 2NF: No partial dependencies
   - 3NF: No transitive dependencies
   - BCNF: Every determinant is a candidate key

3. **SQL Commands**:
   - DDL: CREATE, ALTER, DROP
   - DML: SELECT, INSERT, UPDATE, DELETE
   - DCL: GRANT, REVOKE

4. **ACID Properties**:
   - Atomicity: All or nothing
   - Consistency: Valid state
   - Isolation: Independent transactions
   - Durability: Permanent once committed

5. **Keys**:
   - Primary Key: Unique identifier
   - Foreign Key: Reference to another table
   - Candidate Key: Potential primary keys

What aspect would you like to learn more about?`,

    'operating': `**Operating Systems** 💻

**Core Concepts:**

1. **Process Management**:
   - Process vs Thread
   - Process states: New, Ready, Running, Waiting, Terminated
   - Context switching

2. **CPU Scheduling**:
   - FCFS (First Come First Serve)
   - SJF (Shortest Job First)
   - Round Robin
   - Priority Scheduling

3. **Memory Management**:
   - Paging: Fixed-size blocks
   - Segmentation: Variable-size
   - Virtual Memory

4. **Deadlock**:
   - Conditions: Mutual exclusion, Hold & wait, No preemption, Circular wait
   - Prevention, Avoidance, Detection

5. **File Systems**:
   - File allocation methods
   - Directory structures
   - Access control

Which topic interests you most?`,
  };

  // Find matching topic from knowledge base
  private findTopic(message: string): string | null {
    const lowerMsg = message.toLowerCase();
    
    const topicMap: Record<string, string[]> = {
      'newton': ['newton', 'law of motion', 'inertia', 'f=ma', 'action reaction'],
      'photosynthesis': ['photosynthesis', 'chlorophyll', 'plant', 'carbon dioxide', 'glucose'],
      'quadratic': ['quadratic', 'equation', 'polynomial', 'solve', 'roots', 'formula'],
      'thermodynamics': ['thermodynamics', 'entropy', 'heat', 'energy conservation'],
      'organic': ['organic chemistry', 'functional group', 'alkane', 'iupac', 'isomer'],
      'exam': ['exam', 'test', 'preparation', 'study tip', 'revision'],
      'linear': ['linear algebra', 'matrix', 'vector', 'eigenvalue', 'determinant'],
      'database': ['database', 'sql', 'dbms', 'normalization', 'acid'],
      'operating': ['operating system', 'process', 'cpu scheduling', 'deadlock', 'memory management'],
    };

    for (const [topic, keywords] of Object.entries(topicMap)) {
      if (keywords.some(kw => lowerMsg.includes(kw))) {
        return topic;
      }
    }
    return null;
  }

  // Generate contextual greeting based on profile
  private getContextualGreeting(): string {
    if (!this.userProfile) return '';
    
    const parts = [];
    if (this.userProfile.education_level) {
      parts.push(`I see you're a ${this.userProfile.education_level} student`);
    }
    if (this.userProfile.course) {
      parts.push(`studying ${this.userProfile.course}`);
    }
    if (this.userProfile.subjects?.length) {
      parts.push(`focusing on ${this.userProfile.subjects.slice(0, 3).join(', ')}`);
    }
    
    return parts.length > 0 ? `${parts.join(' ')}. ` : '';
  }

  // Main response generation
  generateResponse(messages: Message[]): string {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      return "I'm here to help! What would you like to learn today?";
    }

    const userInput = lastMessage.content;
    const lowerInput = userInput.toLowerCase();

    // Handle greetings
    if (['hi', 'hello', 'hey', 'good morning', 'good evening'].some(g => lowerInput.includes(g))) {
      const context = this.getContextualGreeting();
      return `Hello! 👋 Welcome to MotiMate AI Tutor! ${context}

I can help you with:
• 📚 Explaining concepts (Physics, Chemistry, Math, CS)
• 📝 Exam preparation tips
• 🧮 Solving problems step-by-step
• 💡 Study techniques

What would you like to learn today?`;
    }

    // Handle help/what can you do
    if (lowerInput.includes('help') || lowerInput.includes('what can you')) {
      return `**I'm MotiMate AI Tutor!** 🎓

I can help you with:

**📚 Subjects I Know:**
- Physics (Mechanics, Thermodynamics)
- Chemistry (Organic, Inorganic)
- Mathematics (Algebra, Calculus)
- Computer Science (OS, DBMS)

**🎯 What I Can Do:**
- Explain concepts simply
- Solve problems step-by-step
- Give exam preparation tips
- Create study plans

**💬 Try asking:**
- "Explain Newton's laws"
- "How to solve quadratic equations"
- "Tips for exam preparation"

What would you like to learn?`;
    }

    // Handle thanks
    if (['thank', 'thanks', 'thankyou'].some(t => lowerInput.includes(t))) {
      return "You're welcome! 😊 Feel free to ask if you have more questions. Happy learning! 📚";
    }

    // Look for topic in knowledge base
    const topic = this.findTopic(userInput);
    if (topic && this.knowledgeBase[topic]) {
      return this.knowledgeBase[topic];
    }

    // Handle mathematical expressions
    if (userInput.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      return `I see you have a mathematical expression! Let me help you solve it step by step.

For complex calculations, please break down your problem and I'll guide you through each step.

**Quick Tips:**
- Show all working
- Check units
- Verify your answer

What specific help do you need with this calculation?`;
    }

    // Context-aware fallback based on user's subjects
    if (this.userProfile?.subjects?.length) {
      const subject = this.userProfile.subjects[0];
      return `Great question! 🤔

I'm here to help you with **${subject}** and other subjects.

Could you please be more specific about what you'd like to learn? For example:
- A specific concept or formula
- A problem you're trying to solve
- A topic you want explained

I'll provide a detailed, step-by-step explanation!`;
    }

    // Generic helpful response
    return `Thank you for your question! 🎓

I'd love to help you understand this better. Could you please:

1. **Be more specific** about the topic
2. **Mention your subject** (Physics, Math, Chemistry, etc.)
3. **Share any context** (exam prep, homework, concept clarity)

**Try asking things like:**
- "Explain photosynthesis in simple terms"
- "How do I solve quadratic equations?"
- "What are Newton's laws of motion?"

I'm here to make learning easier for you! 📚`;
  }
}

// ============================================
// API HANDLER
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI Tutor request received:", { messageCount: messages.length });

    // Initialize AI engine with user context
    const aiEngine = new AIEngine(userProfile);
    
    // Generate response
    const responseText = aiEngine.generateResponse(messages);

    // Return as streaming-compatible format for frontend compatibility
    // This mimics the OpenAI streaming format for easy upgrade later
    const chunks = responseText.match(/.{1,50}/g) || [responseText];
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          const data = {
            choices: [{
              delta: { content: chunk },
              index: 0,
              finish_reason: null
            }]
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          // Small delay for natural typing effect
          await new Promise(r => setTimeout(r, 20));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AI Tutor error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
