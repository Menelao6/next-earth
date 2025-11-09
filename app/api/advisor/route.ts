// app/api/adviser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = "nodejs"; // ensure Node runtime

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// System prompt for the AI adviser
const SYSTEM_PROMPT = `You are Next Earth AI, a climate action adviser. Your role is to provide factual, supportive guidance about climate careers, skills, and regional opportunities.

Key Rules:
- ALWAYS be factual and data-driven
- Keep responses concise (2-3 paragraphs max)
- Focus on actionable advice with specific steps
- Mention relevant climate risks when appropriate
- Suggest micro-learning resources when possible
- Connect advice to the user's skills and location
- Cite data sources like "ASDI/NOAA" when mentioning climate risks
- Never invent roles or organizations - only suggest verified opportunities
- Be encouraging and supportive

Available Context:
- User's country and climate risks
- Their chosen path (help hospitals, support communities, green workforce)
- Their skills and experience level
- Available training resources

Response Style:
- Start with a brief, empathetic acknowledgment
- Provide 2-3 specific, actionable recommendations
- Include micro-learning links when relevant
- End with an encouraging note and next steps`;

export async function POST(request: NextRequest) {
  try {
    const { message, context = {}, conversationHistory = [] } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Server missing OPENAI_API_KEY" }, { status: 500 });
    }

    // Build safe, compact context
    const country = context?.country || "Not specified";
    const path = context?.path || "Not specified";
    const skills = Array.isArray(context?.skills) ? context.skills.join(", ") : "None specified";
    const matchesCount = Number.isFinite(context?.matchesCount) ? context.matchesCount : 0;

    const userContext = `User Profile:
- Country: ${country}
- Path: ${path}
- Skills: ${skills}
- Matches Found: ${matchesCount}`;

    // Limit history to last 10 messages and only keep role/content
    const historyMessages = (conversationHistory || [])
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: String(m.content || "") }));

    const completion = await openai.chat.completions.create({
      model: MODEL,                         // ✅ valid model
      temperature: 0.35,                   // ✅ steadier answers
      max_tokens: 450,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...historyMessages,
        { role: "user", content: `${userContext}\n\nCurrent Question: ${message}` },
      ],
    });

    const response = completion.choices?.[0]?.message?.content?.trim();
    if (!response) throw new Error("No response from AI");

    return NextResponse.json({ response }, { status: 200 });
  } catch (err: any) {
    console.error("OpenAI API error:", err?.response?.data || err?.message || err);
    // Return 500 so client can show a proper error state
    return NextResponse.json(
      {
        response:
          "I'm having trouble reaching the AI right now. Try again in a moment. Meanwhile: check local NGO sites, enroll in a short climate course, and review your top matches.",
        error: "adviser_unavailable",
      },
      { status: 500 }
    );
  }
}