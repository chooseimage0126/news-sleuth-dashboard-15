import { NewsItem } from "../types/news";
import { ChartContainer } from "./ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import Sentiment from 'sentiment';
import { useTheme } from "next-themes";

interface SentimentChartProps {
  news: NewsItem[];
}

const SentimentChart = ({ news }: SentimentChartProps) => {
  const { theme } = useTheme();
  const sentiment = new Sentiment();

  const sentimentRanges = [
    { min: -Infinity, max: -5, label: "Very Negative", color: "#EF4444", pattern: "diagonal" },
    { min: -5, max: -2, label: "Negative", color: "#F97316", pattern: "dots" },
    { min: -2, max: 2, label: "Neutral", color: "#A3A3A3", pattern: "solid" },
    { min: 2, max: 5, label: "Positive", color: "#22C55E", pattern: "dashed" },
    { min: 5, max: Infinity, label: "Very Positive", color: "#15803D", pattern: "zigzag" }
  ];

  const getSentimentInfo = (score: number) => {
    return sentimentRanges.find(range => score > range.min && score <= range.max) || sentimentRanges[2];
  };

  const analyzeSentiment = (text: string): number => {
    const result = sentiment.analyze(text);
    return result.score;
  };

  const sentimentData = news.map((item) => {
    const score = analyzeSentiment(item.title + ' ' + (item.description || ''));
    const sentimentInfo = getSentimentInfo(score);
    return {
      title: item.title.substring(0, 30) + "...",
      source: item.source.name,
      sentiment: score,
      sentimentLabel: sentimentInfo.label,
      sentimentColor: sentimentInfo.color,
      sentimentPattern: sentimentInfo.pattern,
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

  // Create reference areas for sentiment ranges
  const referenceAreas = sentimentRanges.map((range, index) => (
    <ReferenceLine
      key={range.label}
      y={range.max}
      stroke={range.color}
      strokeDasharray={
        range.pattern === "diagonal" ? "3 3" :
        range.pattern === "dots" ? "1 3" :
        range.pattern === "dashed" ? "5 5" :
        range.pattern === "zigzag" ? "10 5" : undefined
      }
      strokeOpacity={0.3}
      label={{
        value: range.label,
        position: 'right',
        fill: theme === 'dark' ? '#fff' : '#000',
        fontSize: 12
      }}
    />
  ));

  return (
    <div className="w-full h-[600px] mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">News Sentiment Analysis</h2>
      
      {/* Sentiment Scale Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Sentiment Scale:
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
          {sentimentRanges.map((range) => (
            <div key={range.label} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: range.color,
                  backgroundImage: range.pattern === "diagonal" ? "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%)" : undefined
                }} 
              />
              <span className="text-xs whitespace-nowrap">
                {range.label}
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  ({range.min === -Infinity ? '≤' : '>'}{range.min})
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <ChartContainer className="h-[450px]" config={chartConfig}>
        <LineChart 
          data={sentimentData}
          margin={{ top: 20, right: 120, bottom: 60, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          {referenceAreas}
          <XAxis 
            dataKey="publishedAt" 
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            domain={[-10, 10]}
            ticks={[-10, -5, -2, 0, 2, 5, 10]}
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
                          (Score: {data.sentiment.toFixed(2)})
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