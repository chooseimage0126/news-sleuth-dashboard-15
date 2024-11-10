import { NewsItem } from "../types/news";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard = ({ news }: NewsCardProps) => {
  const sourceColor = {
    "reuters": "bg-reuters",
    "bbc-news": "bg-bbc",
    "the-new-york-times": "bg-nyt",
    "the-wall-street-journal": "bg-wsj",
    "cnn": "bg-cnn",
  }[news.source.id] || "bg-gray-500";

  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg animate-fade-in"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.urlToImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085"}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className={`absolute top-4 left-4 rounded-full ${sourceColor} px-3 py-1 text-xs font-medium text-white`}>
          {news.source.name}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {news.title}
        </h2>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {news.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </a>
  );
};

export default NewsCard;