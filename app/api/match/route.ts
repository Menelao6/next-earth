// app/api/match/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

// System prompt for the AI matcher
const SYSTEM_PROMPT = `You are Next Earth AI, a climate action matcher.
Your task: given a user's country, path, skills, flags/filters, and (optional) free-text message,
produce the TOP climate roles for them and a short rationale for each.

Rules
- Be factual and practical; keep each "why" to 1–2 sentences.
- Prefer entry paths that are realistic for beginners if the user indicates so.
- Mention relevant hazards briefly when useful (e.g., "high flood" or "heat stress").
- Suggest credible micro-learning links (global NGOs, UN/WHO/IFRC/IRENA, open courses) — no made-up orgs.
- Output MUST be strictly valid JSON (no extra text).

Return JSON schema EXACTLY:
{
  "countryRisk": {
    "summary": "string",                // one line summary (optional)
    "flood": number|null,               // 0..1 or null if unsure
    "cyclone": number|null,             // 0..1 or null if unsure
    "heat": number|null,                // 0..1 or null if unsure
    "source": "ASDI/NOAA or 'various'"  // short source string
  },
  "recommendations": [
    {
      "id": "string",                   // slug-like stable id
      "title": "string",
      "score": number,                  // 0..1 confidence
      "tags": string[],
      "microlearning": [{"title":"string","link":"string"}],
      "why": "string"
    }
  ]
}

Scoring guidance:
- Score 0..1 where 1 = excellent fit.
- Consider user's skills overlap, beginner/equity flags, and stated path/filters.
- If unsure, return fewer roles with higher confidence rather than many low-quality ones.`;

function safeParse<T = unknown>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept flexible inputs; all matching is done by AI
    const {
      message = '',
      country = '',
      path = '',
      age = '',
      skills = [],
      flags = {},
      filters = {},
      conversationHistory = [],
    } = body || {};

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Server missing OPENAI_API_KEY' }, { status: 500 });
    }

    // Compact, explicit user context passed to AI
    const userContext = [
      `Country: ${String(country || 'Not specified')}`,
      `Path: ${String(path || 'Not specified')}`,
      `Age: ${String(age || 'Not specified')}`,
      `Skills: ${Array.isArray(skills) ? skills.join(', ') || 'None specified' : 'None specified'}`,
      `Flags: ${JSON.stringify(flags || {})}`,
      `Filters: ${JSON.stringify(filters || {})}`,
    ].join('\n');

    // Keep only last 8 history turns with role/content shape
    const history = (Array.isArray(conversationHistory) ? conversationHistory : [])
      .slice(-8)
      .map((m: any) => ({ role: m?.role ?? 'user', content: String(m?.content ?? '') }));

    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.35,
      max_tokens: 800,
      response_format: { type: 'json_object' as any },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        {
          role: 'user',
          content:
            `${userContext}\n\n` +
            `User message: ${String(message || '').trim() || '(no message)'}\n\n` +
            `Return STRICT JSON only (no markdown/code fences).`,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content?.trim() || '';
    const parsed = safeParse<{
      countryRisk?: { summary?: string; flood: number|null; cyclone: number|null; heat: number|null; source?: string };
      recommendations?: Array<{ id: string; title: string; score: number; tags: string[]; microlearning: Array<{title:string; link:string}>; why: string }>;
    }>(content);

    if (!parsed || !Array.isArray(parsed.recommendations)) {
      // If AI returned something unusable, surface a clear error
      return NextResponse.json(
        { error: 'ai_invalid_response', detail: 'AI did not return valid recommendations JSON.' },
        { status: 502 }
      );
    }

    // Basic sanity clamp on scores
    const recommendations = parsed.recommendations.map(r => ({
      ...r,
      score: Math.max(0, Math.min(1, Number(r.score ?? 0))),
    }));

    return NextResponse.json({
      countryRisk: {
        summary: parsed.countryRisk?.summary || '',
        flood: parsed.countryRisk?.flood ?? null,
        cyclone: parsed.countryRisk?.cyclone ?? null,
        heat: parsed.countryRisk?.heat ?? null,
        source: parsed.countryRisk?.source || 'various',
      },
      recommendations,
    });
  } catch (err: any) {
    console.error('Match AI error:', err?.response?.data || err?.message || err);
    return NextResponse.json(
      {
        error: 'match_unavailable',
        detail: 'Unable to get matches from AI right now.',
        recommendations: [],
      },
      { status: 500 }
    );
  }
}
