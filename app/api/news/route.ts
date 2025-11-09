// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "disaster";

  const url = "https://api.reliefweb.int/v1/reports";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 1800 },
      body: JSON.stringify({
        query: {
          value: keyword
        },
        limit: 10,
        sort: ["date:desc"],
        fields: {
          include: ["title", "url", "source", "date"]
        }
      }),
    });

    if (!res.ok) {
      throw new Error(`ReliefWeb error: ${res.status}`);
    }

    const data = await res.json();

    const items = data.data
      .filter((i: any) => i.fields.title && i.fields.url && i.fields.date?.created)
      .map((i: any) => ({
        title: i.fields.title,
        source: i.fields.source?.[0]?.name || "ReliefWeb",
        url: i.fields.url,
        publishedAt: i.fields.date.created,
      }));

    return NextResponse.json(items);
  } catch (err) {
    console.error("Error fetching reliefweb:", err);
    return NextResponse.json(
      { error: "Failed to fetch disaster data" },
      { status: 500 }
    );
  }
}

