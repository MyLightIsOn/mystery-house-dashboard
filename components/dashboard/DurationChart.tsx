"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import DataTable from "@/components/dashboard/DataTable";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DurationDatum {
  name: string;
  duration: number;
}

function AverageDurationRadarChart() {
  const [data, setData] = useState<DurationDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/overview");
        const puzzleStats = res.data.puzzles;

        const formatted: DurationDatum[] = puzzleStats.map(
          (p: { puzzle_id: string; avg_duration_seconds: number }) => ({
            name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
            duration: Number(p.avg_duration_seconds ?? 0),
          }),
        );

        setData(formatted);

        const summaryRes = await axios.post("/api/generate-summary/duration", {
          chartData: formatted.map(({ name, duration }) => ({
            name,
            duration,
          })),
        });

        setSummary(summaryRes.data.summary);
      } catch (err) {
        console.error("Error fetching duration data or summary:", err);
        setError("Failed to load chart or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Average Time To Complete</h2>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(val) =>
              setView((val as "chart" | "table") || "chart")
            }
          >
            <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {view === "table" ? (
          <DataTable
            columns={["Puzzle", "Avg Duration (s)"]}
            rows={data.map((d) => [d.name, d.duration])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar
                name="Avg Duration"
                dataKey="duration"
                stroke="#5c589d"
                fill="#5c589d"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
        <div className="mt-4 text-sm border-t-1 border-gray-400 pt-4">
          {loading && <p>Generating AI summary...</p>}
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && summary}
        </div>
      </CardContent>
    </Card>
  );
}

export default AverageDurationRadarChart;
