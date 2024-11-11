import { NewsItem, NewsSource } from "../types/news";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

const mockNewsData: NewsItem[] = [
  {
    title: "Global Markets Rally on Strong Economic Data",
    description: "Stock markets worldwide surge as economic indicators show robust growth and recovery across major economies.",
    url: "https://example.com/news/1",
    urlToImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e",
    publishedAt: new Date().toISOString(),
    source: { id: "reuters", name: "Reuters" }
  },
  {
    title: "Tech Giants Announce Breakthrough in AI Development",
    description: "Leading technology companies reveal major advancements in artificial intelligence capabilities and applications.",
    url: "https://example.com/news/2",
    urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { id: "bbc-news", name: "BBC News" }
  },
  {
    title: "Climate Summit Yields Historic Agreement",
    description: "World leaders reach unprecedented consensus on climate action at international conference.",
    url: "https://example.com/news/3",
    urlToImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167",
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { id: "the-wall-street-journal", name: "Wall Street Journal" }
  },
  {
    title: "Healthcare Innovation: New Treatment Shows Promise",
    description: "Revolutionary medical breakthrough offers hope for patients with previously untreatable conditions.",
    url: "https://example.com/news/4",
    urlToImage: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d",
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { id: "cnn", name: "CNN" }
  },
  {
    title: "Space Exploration: New Discoveries on Mars",
    description: "NASA's latest Mars mission reveals groundbreaking findings about the red planet's potential for sustaining life.",
    url: "https://example.com/news/5",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9",
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { id: "reuters", name: "Reuters" }
  },
  {
    title: "Global Supply Chain Improvements Show Economic Recovery",
    description: "Major improvements in global logistics and supply chain operations signal strong economic rebound.",
    url: "https://example.com/news/6",
    urlToImage: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088",
    publishedAt: new Date(Date.now() - 18000000).toISOString(),
    source: { id: "bbc-news", name: "BBC News" }
  },
  {
    title: "Renewable Energy Sector Sets New Records",
    description: "Solar and wind power generation reach unprecedented levels as countries accelerate green energy transition.",
    url: "https://example.com/news/7",
    urlToImage: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    publishedAt: new Date(Date.now() - 21600000).toISOString(),
    source: { id: "the-wall-street-journal", name: "Wall Street Journal" }
  },
  {
    title: "Breakthrough in Quantum Computing Research",
    description: "Scientists achieve major milestone in quantum computing, bringing practical applications closer to reality.",
    url: "https://example.com/news/8",
    urlToImage: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    publishedAt: new Date(Date.now() - 25200000).toISOString(),
    source: { id: "cnn", name: "CNN" }
  }
];

export const fetchNews = async (source?: NewsSource): Promise<NewsItem[]> => {
  // Check if we're running on localhost
  const isLocalhost = window.location.hostname === "localhost" || 
                     window.location.hostname === "127.0.0.1";

  if (!isLocalhost) {
    // Return mock data when not on localhost
    if (source) {
      return mockNewsData.filter(item => item.source.id === source);
    }
    return mockNewsData;
  }

  // Use real API when on localhost
  const sources = source ? `sources=${source}` : "sources=reuters,bbc-news,the-wall-street-journal,cnn";
  const response = await fetch(
    `${BASE_URL}/top-headlines?${sources}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return data.articles;
};