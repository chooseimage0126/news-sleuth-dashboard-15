import { NewsItem, NewsSource } from "../types/news";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

const mockNewsData: NewsItem[] = [
  {
    title: "Sample News Article 1",
    description: "This is a sample news article for demonstration purposes.",
    url: "https://example.com/news/1",
    urlToImage: "https://images.unsplash.com/photo-1495020689067-958852a7765e",
    publishedAt: new Date().toISOString(),
    source: { id: "reuters", name: "Reuters" }
  },
  {
    title: "Sample News Article 2",
    description: "Another sample news article for testing.",
    url: "https://example.com/news/2",
    urlToImage: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
    publishedAt: new Date().toISOString(),
    source: { id: "bbc-news", name: "BBC News" }
  },
  {
    title: "Sample News Article 3",
    description: "Third sample news article for testing purposes.",
    url: "https://example.com/news/3",
    urlToImage: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167",
    publishedAt: new Date().toISOString(),
    source: { id: "the-wall-street-journal", name: "Wall Street Journal" }
  },
  {
    title: "Sample News Article 4",
    description: "Fourth sample news article for demonstration.",
    url: "https://example.com/news/4",
    urlToImage: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d",
    publishedAt: new Date().toISOString(),
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