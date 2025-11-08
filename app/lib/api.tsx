// API Library for Next Earth

export interface RecommendRequest {
  path: string;
  country: string;
  age: number;
  skills?: string[];
  language?: string;
  equityFlag?: boolean;
}

export interface Microlearning {
  title: string;
  link: string;
}

export interface Recommendation {
  id: string;
  title: string;
  why: string;
  score: number;
  microlearning: Microlearning[];
}

export interface CountryRisk {
  flood: number;
  cyclone: number;
  heat: number;
  source: string;
}

export interface RecommendResponse {
  recommendations: Recommendation[];
  countryRisk?: CountryRisk;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: 'disaster' | 'climate' | 'policy' | 'technology';
  imageUrl?: string;
  location?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  lastUpdated: string;
}

/**
 * Fetch personalized climate action recommendations
 */
export async function postRecommend(data: RecommendRequest): Promise<RecommendResponse> {
  // TODO: Replace with actual API endpoint
  // const response = await fetch('/api/recommend', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return response.json();

  // Mock implementation for development
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Solar Panel Installation Technician',
          why: `Based on your interest in ${data.path.replace(/_/g, ' ')} and location in ${data.country}, this role offers immediate impact in renewable energy deployment.`,
          score: 92,
          microlearning: [
            {
              title: 'Introduction to Solar Energy Systems',
              link: 'https://www.coursera.org/learn/solar-energy-basics'
            },
            {
              title: 'Solar Panel Installation Safety',
              link: 'https://www.osha.gov/solar-energy'
            },
            {
              title: 'Photovoltaic System Design',
              link: 'https://www.nrel.gov/solar/photovoltaic-system-design.html'
            }
          ]
        },
        {
          id: '2',
          title: 'Community Climate Resilience Coordinator',
          why: `Your profile shows strong alignment with community support. This role helps ${data.country} prepare for and respond to climate events.`,
          score: 88,
          microlearning: [
            {
              title: 'Climate Adaptation Planning',
              link: 'https://www.adaptation-fund.org/learning-hub'
            },
            {
              title: 'Community Engagement for Resilience',
              link: 'https://www.fema.gov/emergency-managers/national-preparedness/community-resilience'
            },
            {
              title: 'Disaster Risk Reduction Fundamentals',
              link: 'https://www.preventionweb.net/understanding-disaster-risk'
            }
          ]
        },
        {
          id: '3',
          title: 'Water Conservation Specialist',
          why: `Critical need in ${data.country} for sustainable water management. Your age group (${data.age}) brings fresh perspectives to this field.`,
          score: 85,
          microlearning: [
            {
              title: 'Water Resource Management',
              link: 'https://www.unwater.org/learn'
            },
            {
              title: 'Sustainable Irrigation Techniques',
              link: 'https://www.fao.org/land-water/water/irrigation'
            },
            {
              title: 'Water Conservation Strategies',
              link: 'https://www.epa.gov/watersense'
            }
          ]
        }
      ];

      const mockRisk: CountryRisk = {
        flood: Math.floor(Math.random() * 40) + 30,
        cyclone: Math.floor(Math.random() * 50) + 20,
        heat: Math.floor(Math.random() * 60) + 30,
        source: 'NOAA Climate Data'
      };

      resolve({
        recommendations: mockRecommendations,
        countryRisk: mockRisk
      });
    }, 1500);
  });
}

/**
 * Fetch climate and disaster news updates
 */
export async function getNews(country?: string, category?: string): Promise<NewsResponse> {
  // TODO: Replace with actual API endpoint
  // const params = new URLSearchParams();
  // if (country) params.append('country', country);
  // if (category) params.append('category', category);
  // const response = await fetch(`/api/news?${params.toString()}`);
  // return response.json();

  // Mock implementation for development
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'Record Heat Waves Across Europe Prompt Emergency Response',
          summary: 'Multiple countries activate heat emergency protocols as temperatures reach historic highs. Communities mobilize cooling centers and health support services.',
          url: 'https://example.com/news/heat-wave-europe',
          source: 'Climate News Network',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          category: 'disaster',
          location: 'Europe',
          imageUrl: '/images/news/heatwave.jpg'
        },
        {
          id: '2',
          title: 'New Solar Farm Project Creates 500 Green Jobs',
          summary: 'Major renewable energy initiative launches in partnership with local communities, offering training programs and employment opportunities in solar technology.',
          url: 'https://example.com/news/solar-jobs',
          source: 'Green Energy Today',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          category: 'technology',
          location: country || 'Global',
          imageUrl: '/images/news/solar-farm.jpg'
        },
        {
          id: '3',
          title: 'UN Climate Summit Announces New Funding for Adaptation',
          summary: 'International agreement secures $10 billion for climate adaptation projects in vulnerable regions, focusing on infrastructure and community resilience.',
          url: 'https://example.com/news/un-climate-funding',
          source: 'International Climate Policy',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          category: 'policy',
          location: 'Global'
        },
        {
          id: '4',
          title: 'Coastal Communities Launch Mangrove Restoration Initiative',
          summary: 'Volunteers and environmental groups team up to plant 100,000 mangrove trees to protect coastlines from storm surge and erosion.',
          url: 'https://example.com/news/mangrove-restoration',
          source: 'Ocean Conservation Weekly',
          publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          category: 'climate',
          location: 'Southeast Asia',
          imageUrl: '/images/news/mangrove.jpg'
        },
        {
          id: '5',
          title: 'Wildfire Season Brings Urgent Call for Forest Management',
          summary: 'Extended drought conditions increase fire risk. Emergency services seek volunteers for prevention and rapid response training programs.',
          url: 'https://example.com/news/wildfire-response',
          source: 'Disaster Response Network',
          publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          category: 'disaster',
          location: 'North America'
        },
        {
          id: '6',
          title: 'Breakthrough in Carbon Capture Technology Shows Promise',
          summary: 'New innovation captures CO2 at unprecedented efficiency, potentially revolutionizing industrial emissions reduction at scale.',
          url: 'https://example.com/news/carbon-capture',
          source: 'Science & Climate Journal',
          publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          category: 'technology',
          location: 'Global'
        }
      ];

      // Filter by category if provided
      const filteredArticles = category 
        ? mockArticles.filter(article => article.category === category)
        : mockArticles;

      resolve({
        articles: filteredArticles,
        lastUpdated: new Date().toISOString()
      });
    }, 800);
  });
}

/**
 * Helper function to format relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}