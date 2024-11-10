import { NewsItem } from "../types/news";
import NewsCard from "./NewsCard";
import LoadingCard from "./LoadingCard";

interface NewsGridProps {
  news: NewsItem[];
  isLoading: boolean;
}

const NewsGrid = ({ news, isLoading }: NewsGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <NewsCard key={item.url} news={item} />
      ))}
    </div>
  );
};

export default NewsGrid;