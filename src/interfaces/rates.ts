interface IRateSummary {
  rated: boolean;
  avgRate: number;
  totalRaters: number;
  summary: { value: number; count: number }[];
}

export default IRateSummary;
