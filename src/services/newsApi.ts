import { NewsItem, NewsSource } from "../types/news";

const API_KEY = "YOUR_NEWS_API_KEY"; // Note: In production, this should be in an env variable

const BASE_URL = "https://newsapi.org/v2";

export const fetchNews = async (source?: NewsSource): Promise<NewsItem[]> => {
  const sources = source ? `sources=${source}` : "sources=reuters,bbc-news,the-new-york-times,the-wall-street-journal,cnn";
  const response = await fetch(
    `${BASE_URL}/top-headlines?${sources}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  const data = await response.json();
  return data.articles;
};