import { NewsSource } from "../types/news";

interface SourceFilterProps {
  currentSource: NewsSource | undefined;
  onSourceChange: (source: NewsSource | undefined) => void;
}

const sources = [
  { id: undefined, name: "All Sources", color: "bg-gray-500" },
  { id: "reuters" as NewsSource, name: "Reuters", color: "bg-reuters" },
  { id: "bbc-news" as NewsSource, name: "BBC", color: "bg-bbc" },
  { id: "the-new-york-times" as NewsSource, name: "New York Times", color: "bg-nyt" },
  { id: "the-wall-street-journal" as NewsSource, name: "Wall Street Journal", color: "bg-wsj" },
  { id: "cnn" as NewsSource, name: "CNN", color: "bg-cnn" },
];

const SourceFilter = ({ currentSource, onSourceChange }: SourceFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sources.map((source) => (
        <button
          key={source.name}
          onClick={() => onSourceChange(source.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all
            ${currentSource === source.id ? 
              `${source.color} text-white` : 
              "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
        >
          {source.name}
        </button>
      ))}
    </div>
  );
};

export default SourceFilter;