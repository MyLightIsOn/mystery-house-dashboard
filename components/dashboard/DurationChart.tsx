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
import axios from "axios";
import { PuzzleStats } from "@/types/PuzzleStats";

function DurationChart() {
  const [durationData, setDurationData] = useState<ChartDatum[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await axios.get<{ puzzles: PuzzleStats[] }>(
          "/api/analytics",
        );
        const puzzleStats = analyticsRes.data.puzzles;

        const durations: ChartDatum[] = puzzleStats.map((p) => ({
          name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
          avgDuration: p.avg_duration_seconds,
        }));

        setDurationData(durations);
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
          Average Duration per Puzzle (seconds)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={durationData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgDuration" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default DurationChart;
