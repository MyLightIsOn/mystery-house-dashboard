"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import DataTable from "@/components/dashboard/DataTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CompletionDatum {
  name: string;
  completions: number;
}

function CompletionOverviewChart() {
  const [data, setData] = useState<CompletionDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/overview");
        const puzzleStats = res.data.puzzles;

        const formatted: CompletionDatum[] = puzzleStats.map(
          (p: { puzzle_id: string; completions: number }) => ({
            name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
            completions: Number(p.completions ?? 0),
          }),
        );

        setData(formatted);

        const summaryRes = await axios.post("/api/generate-summary/overview", {
          chartData: formatted,
        });

        setSummary(summaryRes.data.summary);
      } catch (err) {
        console.error("Error fetching completion data or summary:", err);
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
          <h2 className="text-xl font-semibold">Puzzle Completions</h2>
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
            columns={["Puzzle", "Completions"]}
            rows={data.map((d) => [d.name, d.completions])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completions"
                fill="#5c589d"
                radius={[4, 4, 0, 0]}
                name="Completions"
              />
            </BarChart>
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

export default CompletionOverviewChart;
