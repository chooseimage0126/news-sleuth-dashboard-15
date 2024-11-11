import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/newsApi";
import { NewsSource } from "../types/news";
import NewsGrid from "../components/NewsGrid";
import SourceFilter from "../components/SourceFilter";
import SentimentChart from "../components/sentiment/SentimentChart";
import { useToast } from "../hooks/use-toast";
import { useTheme } from "next-themes";
import { Button } from "../components/ui/button";
import { Sun, Moon, Eye } from "lucide-react";

const Index = () => {
  const [selectedSource, setSelectedSource] = useState<NewsSource | undefined>(undefined);
  const [isColorBlindMode, setIsColorBlindMode] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            News Sentiment Analysis Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsColorBlindMode(!isColorBlindMode)}
              className={`h-10 w-10 ${isColorBlindMode ? 'bg-primary/10' : ''}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-8">
          <SentimentChart news={news} isColorBlindMode={isColorBlindMode} />
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