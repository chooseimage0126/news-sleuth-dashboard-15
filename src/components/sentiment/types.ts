export interface SentimentRange {
  min: number;
  max: number;
  label: string;
  color: string;
  pattern: string;
}

export interface SentimentData {
  title: string;
  source: string;
  sentiment: number;
  sentimentLabel: string;
  sentimentColor: string;
  sentimentPattern: string;
  publishedAt: string;
}