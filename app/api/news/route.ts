// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "disaster";

  const apiKey = process.env.NEWS_API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Next.js Disaster News App" },
      next: { revalidate: 1800 }, // cache for 30 minutes
    });

    if (!res.ok) {
      throw new Error(`NewsAPI error: ${res.status}`);
    }

    const data = await res.json();

    const items = data.articles
      .filter((a: any) => a.title && a.url && a.source?.name && a.publishedAt)
      .map((a: any) => ({
        title: a.title,
        source: a.source.name,
        url: a.url,
        publishedAt: a.publishedAt,
      }));

    return NextResponse.json(items);
  } catch (err) {
    console.error("Error fetching news:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
