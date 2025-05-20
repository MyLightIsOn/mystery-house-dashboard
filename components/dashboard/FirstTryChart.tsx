"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";
import { ChartDatum } from "@/types/ChartDatum";

interface FirstTrySuccess {
  puzzle_id: string;
  total_sessions: number;
  first_try_successes: number;
  success_rate_percent: number;
}

function FirstTrySuccessChart() {
  const [data, setData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<FirstTrySuccess[]>(
          "/api/analytics/first-try",
        );
        const chartData: ChartDatum[] = res.data.map((item) => ({
          name: `Puzzle ${item.puzzle_id.replace("puzzle_", "")}`,
          successRate: item.success_rate_percent,
          firstTry: item.first_try_successes,
        }));
        setData(chartData);
      } catch (error) {
        console.error("Error fetching first-try success data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          First-Try Success Rate by Puzzle
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="firstTry"
              fill="#5c589d"
              name="First Try Completions"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="right"
              dataKey="successRate"
              fill="#82ca9d"
              name="Success Rate (%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default FirstTrySuccessChart;
