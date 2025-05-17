"use client";

import React, { useState } from "react";
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
import { PuzzleStats } from "@/types/PuzzleStats";
import axios from "axios";

function CompletionChart() {
  const [completionData, setCompletionData] = useState<ChartDatum[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await axios.get<{ puzzles: PuzzleStats[] }>(
          "/api/analytics",
        );
        const puzzleStats = analyticsRes.data.puzzles;

        const completions: ChartDatum[] = puzzleStats.map((p) => ({
          name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
          completions: p.completions,
        }));

        setCompletionData(completions);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Puzzle Completion Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={completionData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completions" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default CompletionChart;
