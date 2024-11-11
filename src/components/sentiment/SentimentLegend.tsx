import { SentimentRange } from "./types";

interface SentimentLegendProps {
  sentimentRanges: SentimentRange[];
}

export const SentimentLegend = ({ sentimentRanges }: SentimentLegendProps) => (
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
);