// app/api/news/route.ts

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // this is important

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 500 });

  const keywordSet = [
    "earthquake", "flood", "typhoon",
    "\"humanitarian aid\"", "\"relief mission\"", "drought"
  ];

  const userKeyword = (searchParams.get("keyword") || "").trim();
  if (userKeyword && userKeyword.length <= 20) keywordSet.push(userKeyword);

  const q = encodeURIComponent(keywordSet.join(" OR "));

  // request 3 pages
  const urls = [1,2,3].map(p =>
    `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&q=${q}&page=${p}`
  );

  try {
    const pages = await Promise.all(urls.map(u => fetch(u).then(r => r.json())));
    const allResults = pages.flatMap(p => p.results || []);

    const items = allResults
      .filter(a =>
        a.title &&
        keywordSet.some(k => a.title.toLowerCase().includes(k.replace(/"/g,"").toLowerCase()))
      )
      .map(a => ({
        title: a.title,
        source: a.source_id,
        url: a.link,
        publishedAt: a.pubDate,
      }));

    // also remove duplicates by url
    const dedup = Array.from(new Map(items.map(i => [i.url, i])).values());

    return NextResponse.json(dedup);
  } catch (e:any) {
    return NextResponse.json({error:e.message}, {status:500});
  }
}
