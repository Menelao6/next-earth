// app/api/match/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with your actual data sources
const rolesData = [
  {
    id: "role_01",
    title: "Community Health Worker",
    skills: ["first aid", "communication", "organizing"],
    tags: ["healthcare", "beginner"],
    hazard_fit: { flood: 0.8, cyclone: 0.6, heat: 0.7 },
    categories: ["Healthcare"],
    microlearning: [
      { title: "Basic First Aid", link: "https://example.com/first-aid" },
      { title: "Community Outreach", link: "https://example.com/outreach" }
    ]
  },
  {
    id: "role_02",
    title: "Relief Logistics Coordinator",
    skills: ["organizing", "logistics", "communication"],
    tags: ["logistics"],
    hazard_fit: { flood: 0.9, cyclone: 0.8, heat: 0.5 },
    categories: ["Logistics"],
    microlearning: [
      { title: "Emergency Logistics", link: "https://example.com/logistics" }
    ]
  },
  {
    id: "role_03",
    title: "Solar Installation Assistant",
    skills: ["technical", "problem solving"],
    tags: ["energy", "beginner"],
    hazard_fit: { flood: 0.4, cyclone: 0.3, heat: 0.9 },
    categories: ["Energy"],
    microlearning: [
      { title: "Solar Basics", link: "https://example.com/solar" }
    ]
  }
];

const riskByCountry = {
  Philippines: { flood: 0.8, cyclone: 0.9, heat: 0.7 },
  Kenya: { flood: 0.6, cyclone: 0.2, heat: 0.8 },
  India: { flood: 0.7, cyclone: 0.6, heat: 0.9 },
  Bangladesh: { flood: 0.9, cyclone: 0.8, heat: 0.7 },
  Indonesia: { flood: 0.7, cyclone: 0.7, heat: 0.8 },
  Vietnam: { flood: 0.8, cyclone: 0.7, heat: 0.8 },
  Nigeria: { flood: 0.6, cyclone: 0.3, heat: 0.9 },
  Brazil: { flood: 0.7, cyclone: 0.4, heat: 0.8 }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, country, age, skills = [], flags = {}, filters = {} } = body;

    // Get country risk data
    const countryRisk = riskByCountry[country as keyof typeof riskByCountry] || { flood: 0.5, cyclone: 0.5, heat: 0.5 };

    // Filter and score roles
    const scoredRoles = rolesData
      .filter(role => {
        // Filter by categories if specified
        if (filters.categories?.length > 0) {
          return filters.categories.some((category: string) => 
            role.categories.includes(category)
          );
        }
        return true;
      })
      .map(role => {
        // Hazard fit calculation
        const hazardFit = 0.5 * (countryRisk.flood * role.hazard_fit.flood) +
                         0.3 * (countryRisk.cyclone * role.hazard_fit.cyclone) +
                         0.2 * (countryRisk.heat * role.hazard_fit.heat);

        // Skill overlap (Jaccard similarity)
        const skillSet = new Set(role.skills);
        const userSkillSet = new Set(skills);
        const intersection = new Set([...skillSet].filter(x => userSkillSet.has(x)));
        const union = new Set([...skillSet, ...userSkillSet]);
        const skillOverlap = union.size > 0 ? intersection.size / union.size : 0;

        // Boosts
        const beginnerBoost = flags.beginner && role.tags.includes("beginner") ? 0.08 : 0;
        const equityBoost = flags.equity ? 0.1 : 0;

        // Final score
        const score = 0.45 * hazardFit + 0.45 * skillOverlap + 0.1 * (beginnerBoost + equityBoost);

        return {
          ...role,
          score,
          skillOverlap,
          hazardFit
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Generate explanations (in a real app, you'd call OpenAI here)
    const recommendations = scoredRoles.map(role => ({
      id: role.id,
      title: role.title,
      score: Math.round(role.score * 100) / 100,
      tags: role.tags,
      microlearning: role.microlearning,
      why: generateExplanation(role, country, countryRisk, skills)
    }));

    return NextResponse.json({
      countryRisk: {
        ...countryRisk,
        source: "ASDI/NOAA"
      },
      recommendations
    });

  } catch (error) {
    console.error('Match API error:', error);
    return NextResponse.json({ error: 'Failed to generate matches' }, { status: 500 });
  }
}

function generateExplanation(role: any, country: string, risk: any, skills: string[]): string {
  const hazards = [];
  if (risk.flood > 0.6) hazards.push(`flood risk (${Math.round(risk.flood * 100)}%)`);
  if (risk.cyclone > 0.6) hazards.push(`cyclone risk (${Math.round(risk.cyclone * 100)}%)`);
  if (risk.heat > 0.6) hazards.push(`heat stress (${Math.round(risk.heat * 100)}%)`);

  const hazardText = hazards.length > 0 ? hazards.join(' and ') : 'moderate climate risks';
  
  const userSkills = role.skills.filter((skill: string) => skills.includes(skill));
  const skillText = userSkills.length > 0 ? 
    `your ${userSkills.slice(0, 2).join(' and ')} skills` : 
    'your profile';

  return `${country} faces ${hazardText}; ${skillText} align well with ${role.title.toLowerCase()} roles (ASDI/NOAA).`;
}