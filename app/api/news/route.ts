// app/api/news/route.ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();

// Curated keywords for natural disasters and humanitarian aid
const KEYWORDS = [
  "earthquake",
  "flood",
  "wildfire",
  "hurricane",
  "\"humanitarian aid\"",
  "\"relief mission\"",
  "\"natural disaster\"",
  "drought",
  "famine",
  "evacuation",
  "rescue"
];

// Utility: build Google News RSS search URL
function buildRssUrl(keywords: string[]) {
  const query = keywords.join(" OR ");
  // Google News RSS with English results
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userKeyword = (searchParams.get("keyword") || "").trim();
    const keywords = userKeyword ? [...KEYWORDS, userKeyword] : KEYWORDS;

    const rssUrl = buildRssUrl(keywords);

    // Parse the RSS feed
    const feed = await parser.parseURL(rssUrl);

    if (!feed.items || feed.items.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Map feed items to a simpler format
    const items = feed.items
      .filter(item => item.title && item.link && item.pubDate)
      .map(item => ({
        title: item.title || "",
        source: item.creator || "Google News",
        url: item.link || "",
        publishedAt: item.pubDate || "",
      }));

    return NextResponse.json(items);

  } catch (err: any) {
    console.error("Error fetching Google News RSS:", err);
    return NextResponse.json(
      { error: "Failed to fetch news", details: err.message || err },
      { status: 500 }
    );
  }
}
