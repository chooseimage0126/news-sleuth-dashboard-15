import { NewsItem, NewsSource } from "../types/news";

const API_KEY = "6fbcd204d1db4e59977cf9b9e6e4c651";
const BASE_URL = "https://newsapi.org/v2";

export const fetchNews = async (source?: NewsSource): Promise<NewsItem[]> => {
  const sources = source ? `sources=${source}` : "sources=reuters";
  const response = await fetch(
    `${BASE_URL}/top-headlines?${sources}&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 426) {
      throw new Error("This demo only works on localhost due to API restrictions. Please run the project locally.");
    }
    throw new Error(errorData.message || "Failed to fetch news");
  }

  const data = await response.json();
  return data.articles;
};