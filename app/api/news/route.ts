// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = (searchParams.get("keyword") || "").trim() || undefined;
  const url = "https://api.reliefweb.int/v1/reports";
 
  const base = {
    limit: 10,
    sort: ["date:desc"],
    fields: { include: ["title", "url", "source", "date"] },
  };

  const body = keyword ? { ...base, query: { value: keyword } } : base;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ReliefWebNewsApp/1.0",
      },
      next: { revalidate: 1800 },
      body: JSON.stringify(body),
    });

    // capture the response text if not ok
    if (!res.ok) {
      const text = await res.text();
      console.error("ReliefWeb fetch failed:", res.status, text);
      return NextResponse.json(
        { error: `ReliefWeb error ${res.status}`, details: text },
        { status: res.status }
      );
    }

    const data = await res.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.error("Unexpected ReliefWeb data:", data);
      return NextResponse.json(
        { error: "Unexpected data structure from ReliefWeb", debug: data },
        { status: 500 }
      );
    }

    const items = data.data
      .filter((i: any) => i.fields.title && i.fields.url && i.fields.date?.created)
      .map((i: any) => ({
        title: i.fields.title,
        source: i.fields.source?.[0]?.name || "ReliefWeb",
        url: i.fields.url,
        publishedAt: i.fields.date.created,
      }));

    // if no items, return debug info
    if (items.length === 0) {
      console.warn("ReliefWeb returned no reports", data);
    }

    return NextResponse.json(items);
  } catch (err: any) {
    console.error("Error fetching ReliefWeb:", err);
    return NextResponse.json(
      { error: "Failed to fetch disaster data", details: err.message || err },
      { status: 500 }
    );
  }
}
