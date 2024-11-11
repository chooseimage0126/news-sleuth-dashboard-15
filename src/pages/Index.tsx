import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/newsApi";
import { NewsSource } from "../types/news";
import NewsGrid from "../components/NewsGrid";
import SourceFilter from "../components/SourceFilter";
import SentimentChart from "../components/SentimentChart";
import { useToast } from "../components/ui/use-toast";

const Index = () => {
  const [selectedSource, setSelectedSource] = useState<NewsSource | undefined>(undefined);
  const { toast } = useToast();

  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ["news", selectedSource],
    queryFn: () => fetchNews(selectedSource),
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          News Sentiment Analysis Dashboard
        </h1>
        <div className="space-y-8">
          <SentimentChart news={news} />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              News Articles
            </h2>
            <SourceFilter
              currentSource={selectedSource}
              onSourceChange={setSelectedSource}
            />
            <NewsGrid news={news} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;