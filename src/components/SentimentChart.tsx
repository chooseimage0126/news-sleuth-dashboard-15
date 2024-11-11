import { NewsItem } from "../types/news";
import { ChartContainer } from "./ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Sentiment from 'sentiment';

interface SentimentChartProps {
  news: NewsItem[];
}

const SentimentChart = ({ news }: SentimentChartProps) => {
  const sentiment = new Sentiment();

  const getSentimentLabel = (score: number): string => {
    if (score <= -5) return "Very Negative";
    if (score < -2) return "Negative";
    if (score < 2) return "Neutral";
    if (score < 5) return "Positive";
    return "Very Positive";
  };

  const getSentimentColor = (score: number): string => {
    if (score <= -5) return "#EF4444"; // Red
    if (score < -2) return "#F97316"; // Orange
    if (score < 2) return "#A3A3A3"; // Gray
    if (score < 5) return "#22C55E"; // Green
    return "#15803D"; // Dark Green
  };

  const analyzeSentiment = (text: string): number => {
    const result = sentiment.analyze(text);
    return result.score;
  };

  const sentimentData = news.map((item) => {
    const score = analyzeSentiment(item.title + ' ' + (item.description || ''));
    return {
      title: item.title.substring(0, 30) + "...",
      source: item.source.name,
      sentiment: score,
      sentimentLabel: getSentimentLabel(score),
      sentimentColor: getSentimentColor(score),
      publishedAt: new Date(item.publishedAt).toLocaleDateString()
    };
  });

  const sourceColors: { [key: string]: string } = {
    "Reuters": "#FF8C00",
    "BBC News": "#BB1919",
    "Wall Street Journal": "#0080C6",
    "CNN": "#CC0000"
  };

  const chartConfig = {
    line: {
      theme: {
        light: "hsl(0 0% 0%)",
        dark: "hsl(0 0% 100%)",
      },
    },
    grid: {
      theme: {
        light: "hsl(0 0% 90%)",
        dark: "hsl(0 0% 20%)",
      },
    },
  };

  return (
    <div className="w-full h-[600px] mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">News Sentiment Analysis</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Sentiment Scale:
        </div>
        <div className="flex gap-2">
          {[
            { label: "Very Negative", color: "#EF4444" },
            { label: "Negative", color: "#F97316" },
            { label: "Neutral", color: "#A3A3A3" },
            { label: "Positive", color: "#22C55E" },
            { label: "Very Positive", color: "#15803D" }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ChartContainer className="h-[450px]" config={chartConfig}>
        <LineChart data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="publishedAt" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            label={{ 
              value: 'Sentiment', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
            ticks={[-5, -2, 0, 2, 5]}
            tickFormatter={(value) => getSentimentLabel(value)}
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 dark:text-white">{data.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{data.source}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: data.sentimentColor }} 
                      />
                      <p className="text-sm">
                        <span className="font-medium">{data.sentimentLabel}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-1">
                          (Score: {data.sentiment})
                        </span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => (
              <span className="text-sm font-medium">{value}</span>
            )}
          />
          {Object.entries(sourceColors).map(([source, color]) => (
            <Line
              key={source}
              type="monotone"
              dataKey="sentiment"
              data={sentimentData.filter(item => item.source === source)}
              name={source}
              stroke={color}
              strokeWidth={2}
              dot={{ 
                fill: color,
                strokeWidth: 2,
                r: 4,
                strokeOpacity: 0.8
              }}
              activeDot={{ 
                r: 6,
                stroke: color,
                strokeWidth: 2,
                fill: "white"
              }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default SentimentChart;