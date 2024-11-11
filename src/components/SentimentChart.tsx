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
    <div className="w-full h-96 mb-8 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">News Sentiment Analysis</h2>
      <div className="text-sm text-gray-500 mb-4">
        Sentiment ranges from Very Negative (-5 or lower) to Very Positive (5 or higher)
      </div>
      <ChartContainer className="h-80" config={chartConfig}>
        <LineChart data={sentimentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="publishedAt" 
            angle={-45}
            textAnchor="end"
            height={60}
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
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-gray-200 rounded shadow">
                    <p className="font-semibold">{data.title}</p>
                    <p className="text-sm text-gray-600">{data.source}</p>
                    <p className="text-sm">
                      Sentiment: {data.sentimentLabel}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm font-medium">{value}</span>}
          />
          {Object.entries(sourceColors).map(([source, color]) => (
            <Line
              key={source}
              type="monotone"
              dataKey="sentiment"
              data={sentimentData.filter(item => item.source === source)}
              name={source}
              stroke={color}
              dot={{ fill: color }}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default SentimentChart;