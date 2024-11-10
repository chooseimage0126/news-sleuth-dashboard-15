export interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    id: string;
    name: string;
  };
}

export type NewsSource = "reuters" | "bbc-news" | "the-new-york-times" | "the-wall-street-journal" | "cnn";