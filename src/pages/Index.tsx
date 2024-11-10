import { useState } from "react";
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch news. Please try again later.",
        variant: "destructive",
      });
    },
  });

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