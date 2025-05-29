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
import LoadingButton from "@/components/custom/loading-button";

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
  const [summaryText, setSummaryText] = useState<boolean>(false);

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
      } catch (err) {
        console.error("Error fetching duration data or summary:", err);
        setError("Failed to load chart or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateSummary = async () => {
    const summaryRes = await axios.post("/api/generate-summary/duration", {
      chartData: data.map(({ name, duration }) => ({
        name,
        duration,
      })),
    });

    setSummary(summaryRes.data.summary);
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Average Time To Complete</h2>
          <ToggleGroup
            type="single"
            value={view}
            className={"border border-black"}
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
          {error && <span className="text-red-500">{error}</span>}
          {!loading && !error && summaryText && summary}
          {!error && !summary && (
            <LoadingButton
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                generateSummary().then(() => {
                  setSummaryText(true);
                  setLoading(false);
                });
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AverageDurationRadarChart;
