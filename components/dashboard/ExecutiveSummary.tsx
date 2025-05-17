"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PuzzleStats {
  puzzle_id: string;
  completions: number;
  avg_duration_seconds: number;
}

interface DropoffStats {
  [key: string]: {
    started: number;
    completed: number;
  };
}

interface ChartDatum {
  name: string;
  completions?: number;
  avgDuration?: number;
  started?: number;
  completed?: number;
}

export default function ExecutiveSummary() {
  const [completionData, setCompletionData] = useState<ChartDatum[]>([]);
  const [durationData, setDurationData] = useState<ChartDatum[]>([]);
  const [dropoffData, setDropoffData] = useState<ChartDatum[]>([]);

  useEffect(() => {
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

        const durations: ChartDatum[] = puzzleStats.map((p) => ({
          name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
          avgDuration: p.avg_duration_seconds,
        }));

        setCompletionData(completions);
        setDurationData(durations);

        const dropoffRes = await axios.get<DropoffStats>(
          "/api/analytics/dropoff",
        );
        const dropoff: ChartDatum[] = Object.entries(dropoffRes.data).map(
          ([key, value]) => ({
            name: `Puzzle ${key.replace("puzzle_", "")}`,
            started: value.started,
            completed: value.completed,
          }),
        );

        setDropoffData(dropoff);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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

      <Card className="md:col-span-2">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Puzzle Drop-off: Started vs Completed
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dropoffData}>
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
    </div>
  );
}
