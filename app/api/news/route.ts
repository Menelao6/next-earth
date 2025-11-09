// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = (searchParams.get("keyword") || "").trim();
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }

  // build query string without page_size
  const qParam = keyword ? `q=${encodeURIComponent(keyword)}` : "";
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en&${qParam}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NewsDataClient/1.0"
      },
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("NewsData fetch failed:", res.status, text);
      return NextResponse.json(
        { error: `NewsData error ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.results || !Array.isArray(data.results)) {
      console.error("Unexpected NewsData structure:", data);
      return NextResponse.json(
        { error: "Unexpected data structure from NewsData", debug: data },
        { status: 500 }
      );
    }

    const items = data.results
      .filter((a: any) => a.title && a.link && a.source_id && a.pubDate)
      .map((a: any) => ({
        title: a.title,
        source: a.source_id,
        url: a.link,
        publishedAt: a.pubDate,
      }));

    return NextResponse.json(items);

  } catch (err: any) {
    console.error("Error fetching NewsData:", err);
    return NextResponse.json(
      { error: "Failed to fetch news data", details: err.message || err },
      { status: 500 }
    );
  }
}
