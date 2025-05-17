import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDatum } from "@/types/ChartDatum";

type ImprovementChartData = {
  data: ChartDatum[];
};

function ImprovementChart({ data }: ImprovementChartData) {
  return (
    <Card className="md:col-span-2">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Improvement Score (First vs Last Attempt)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="improvement" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ImprovementChart;
