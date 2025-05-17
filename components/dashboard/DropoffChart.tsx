import React from "react";
import { ChartDatum } from "@/types/ChartDatum";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DropoffChartData = {
  data: ChartDatum[];
};

function DropoffChart({ data }: DropoffChartData) {
  return (
    <Card className="md:col-span-2">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Puzzle Drop-off: Started vs Completed
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="started" fill="#ffc658" radius={[4, 4, 0, 0]} />
            <Bar dataKey="completed" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default DropoffChart;
