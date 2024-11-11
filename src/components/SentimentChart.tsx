import { NewsItem } from "../types/news";
import { ChartContainer } from "./ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Sentiment from 'sentiment';

interface SentimentChartProps {
  news: NewsItem[];
}

const SentimentChart = ({ news }: SentimentChartProps) => {
  const sentiment = new Sentiment();

  const analyzeSentiment = (text: string): number => {
    const result = sentiment.analyze(text);
    return result.score;
  };

  const sentimentData = news.map((item) => ({
    title: item.title.substring(0, 30) + "...",
    source: item.source.name,
    sentiment: analyzeSentiment(item.title + ' ' + (item.description || '')),
    publishedAt: new Date(item.publishedAt).toLocaleDateString()
  }));

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
              value: 'Sentiment Score', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }} 
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
                      Sentiment: {data.sentiment.toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
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