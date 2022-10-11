interface IRateSummary {
  rated: boolean;
  avgRate: number;
  total: number;
  summary: { value: number; count: number }[];
}

export default IRateSummary;
