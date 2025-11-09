// app/api/news/route.ts
import { NextResponse } from "next/server";

const MAX_QUERY_LENGTH = 100; // NewsData.io limit

// Large list of humanitarian / natural disaster keywords
const ALL_KEYWORDS = [
  "earthquake", "flood", "wildfire", "hurricane", "tsunami", "tornado", "storm",
  "\"humanitarian aid\"", "\"relief mission\"", "\"natural disaster\"", "drought", "famine",
  "evacuation", "rescue", "emergency", "disaster relief", "disaster response", "aid",
  "climate disaster", "landslide", "volcano", "cyclone"
];

// Utility to create batches of keywords under 100 chars when joined with ' OR '
function createKeywordBatches(keywords: string[]): string[] {
  const batches: string[] = [];
  let batch: string[] = [];
  let batchLength = 0;

  for (const kw of keywords) {
    const kwLength = kw.length + (batch.length > 0 ? 4 : 0); // +4 for ' OR ' if not first
    if (batchLength + kwLength > MAX_QUERY_LENGTH) {
      if (batch.length > 0) batches.push(batch.join(" OR "));
      batch = [kw];
      batchLength = kw.length;
    } else {
      batch.push(kw);
      batchLength += kwLength;
    }
  }
  if (batch.length > 0) batches.push(batch.join(" OR "));
  return batches;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // Optional user keyword
  const userKeyword = (searchParams.get("keyword") || "").trim();
  const keywords = userKeyword ? [...ALL_KEYWORDS, userKeyword] : ALL_KEYWORDS;

  const batches = createKeywordBatches(keywords);

  const allItems: any[] = [];

  try {
    // Fetch multiple pages for each batch
    for (const batch of batches) {
      for (let page = 1; page <= 2; page++) { // fetch page 1 and 2 for more results
        const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&q=${encodeURIComponent(batch)}&page=${page}`;
        const res = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json", "User-Agent": "NewsDataClient/1.0" },
          next: { revalidate: 1800 },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("NewsData fetch failed:", res.status, text);
          continue; // skip this page/batch
        }

        const data = await res.json();
        if (!data.results || !Array.isArray(data.results)) continue;

        allItems.push(...data.results);
      }
    }

    // Filter results by keywords in title (case-insensitive)
    const keywordStrings = keywords.map(k => k.replace(/"/g, "").toLowerCase());
    const items = allItems
      .filter(a =>
        a.title &&
        a.link &&
        a.source_id &&
        a.pubDate &&
        keywordStrings.some(k => a.title.toLowerCase().includes(k))
      )
      .map(a => ({
        title: a.title,
        source: a.source_id,
        url: a.link,
        publishedAt: a.pubDate,
      }));

    // Remove duplicates based on URL
    const uniqueItems = Array.from(new Map(items.map(i => [i.url, i])).values());

    return NextResponse.json(uniqueItems);

  } catch (err: any) {
    console.error("Error fetching NewsData:", err);
    return NextResponse.json(
      { error: "Failed to fetch news data", details: err.message || err },
      { status: 500 }
    );
  }
}
