export interface ChartDatum {
  name: string;
  completions?: number;
  avgDuration?: number;
  started?: number;
  completed?: number;
  improvement?: number;
  data?: ChartDatum[];
}
