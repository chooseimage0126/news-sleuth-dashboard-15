import { NewsItem } from "../types/news";
import { ChartContainer } from "./ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SentimentChartProps {
  news: NewsItem[];
}

const SentimentChart = ({ news }: SentimentChartProps) => {
  // Simple sentiment analysis based on positive/negative keywords
  const positiveWords = ['success', 'growth', 'positive', 'gain', 'rise', 'up', 'boost', 'improve'];
  const negativeWords = ['decline', 'fall', 'negative', 'loss', 'down', 'crisis', 'fail', 'risk'];

  const analyzeSentiment = (text: string): number => {
    const words = text.toLowerCase().split(' ');
    let score = 0;
    words.forEach(word => {
      if (positiveWords.includes(word)) score++;
      if (negativeWords.includes(word)) score--;
    });
    return score;
  };

  const sentimentData = news.reduce((acc, item) => {
    const sourceName = item.source.name;
    const sentiment = analyzeSentiment(item.title + ' ' + (item.description || ''));
    
    const existingSource = acc.find(d => d.source === sourceName);
    if (existingSource) {
      existingSource.sentiment = (existingSource.sentiment + sentiment) / 2;
    } else {
      acc.push({ source: sourceName, sentiment });
    }
    return acc;
  }, [] as Array<{ source: string; sentiment: number }>);

  const config = {
    positive: {
      theme: {
        light: "#22c55e",
        dark: "#22c55e"
      }
    },
    negative: {
      theme: {
        light: "#ef4444",
        dark: "#ef4444"
      }
    }
  };

  return (
    <div className="w-full h-64 mb-8 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">News Sentiment Analysis</h2>
      <ChartContainer className="h-48" config={config}>
        <BarChart data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="source" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="sentiment"
            fill={(entry) => (entry > 0 ? "#22c55e" : "#ef4444")}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default SentimentChart;