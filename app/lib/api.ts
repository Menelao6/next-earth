export type RecommendResponse = {
  countryRisk: { flood: number; cyclone: number; heat: number; source: string };
  recommendations: {
    id: string;
    title: string;
    score: number;
    microlearning: { title: string; link: string }[];
    why: string;
  }[];
};

export type NewsResponse = {
  items: { title: string; source: string; url: string; publishedAt: string }[];
};

const mock = () => process.env.NEXT_PUBLIC_MOCK === "1";

export async function postRecommend(body: any): Promise<RecommendResponse> {
  const url = mock() ? "/pages/api/recommend" : "/api/recommend";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Recommend API failed");
  return res.json();
}

export async function getNews(params: { country: string; topic?: string }): Promise<NewsResponse> {
  const url = mock()
    ? "/pages/api/news"
    : `/api/news?country=${encodeURIComponent(params.country)}&topic=${encodeURIComponent(params.topic || "climate")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("News API failed");
  return res.json();
}
