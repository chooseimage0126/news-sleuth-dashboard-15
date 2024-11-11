import { NewsItem, NewsSource } from "../types/news";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2";

// Helper function to generate timestamps
const getRandomPastTime = (index: number) => {
  return new Date(Date.now() - (index * 1800000 + Math.random() * 1800000)).toISOString();
};

// Generate 20 stories for each source
const generateStoriesForSource = (sourceId: string, sourceName: string): NewsItem[] => {
  const topics = [
    ["Economy", "Markets", "Trade", "Finance", "Business"],
    ["Technology", "Innovation", "Digital", "AI", "Cybersecurity"],
    ["Climate", "Environment", "Energy", "Sustainability", "Conservation"],
    ["Health", "Medicine", "Research", "Wellness", "Healthcare"],
    ["Politics", "Policy", "Government", "Diplomacy", "International"]
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const topicGroup = topics[Math.floor(i / 4)];
    const topic = topicGroup[i % topicGroup.length];
    const sentiment = Math.random() > 0.5 ? "positive" : "challenging";
    
    return {
      title: `${topic}: ${sentiment === "positive" ? "Breakthrough" : "Concerns"} in ${sourceName}'s Latest Report`,
      description: `${sourceName} reports ${sentiment} developments in ${topic.toLowerCase()} sector, highlighting significant changes and future implications for global markets and society.`,
      url: `https://example.com/news/${sourceId}/${i + 1}`,
      urlToImage: `https://images.unsplash.com/photo-${1500000000000 + i}`,
      publishedAt: getRandomPastTime(i),
      source: { id: sourceId, name: sourceName }
    };
  });
};

const mockNewsData: NewsItem[] = [
  ...generateStoriesForSource("reuters", "Reuters"),
  ...generateStoriesForSource("bbc-news", "BBC News"),
  ...generateStoriesForSource("the-wall-street-journal", "Wall Street Journal"),
  ...generateStoriesForSource("cnn", "CNN")
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
