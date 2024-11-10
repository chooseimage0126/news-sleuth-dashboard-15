import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/newsApi";
import { NewsSource } from "../types/news";
import NewsGrid from "../components/NewsGrid";
import SourceFilter from "../components/SourceFilter";
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
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch news. Please try again later.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="mb-8 text-4xl font-bold text-gray-900">Latest News</h1>
        <SourceFilter
          currentSource={selectedSource}
          onSourceChange={setSelectedSource}
        />
        <NewsGrid news={news} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;