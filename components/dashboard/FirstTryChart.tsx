"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import DataTable from "@/components/dashboard/DataTable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface FirstTryDatum {
  name: string;
  successRate: number;
  firstTry: number;
}

function FirstTrySuccessChart() {
  const [data, setData] = useState<FirstTryDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/first-try-success");

        const formatted: FirstTryDatum[] = res.data.map(
          (item: {
            puzzle_id: string;
            first_try_successes: number;
            success_rate_percent: number;
          }) => ({
            name: `Puzzle ${parseInt(item.puzzle_id.replace("puzzle_", "")) + 1}`,
            firstTry: item.first_try_successes,
            successRate: item.success_rate_percent,
          }),
        );

        setData(formatted);

        const summaryRes = await axios.post(
          "/api/generate-summary/first-try-success",
          {
            chartData: formatted,
          },
        );

        setSummary(summaryRes.data.summary);
      } catch (err) {
        console.error("Error fetching first try success data or summary:", err);
        setError("Failed to load chart or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">First Try Success Rate</h2>
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
            columns={["Puzzle", "Success Rate (%)", "First Try Count"]}
            rows={data.map((d) => [d.name, d.successRate, d.firstTry])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 16, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="successRate"
                stroke="#5c589d"
                name="Success Rate (%)"
                strokeWidth={5}
              />
            </LineChart>
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

export default FirstTrySuccessChart;
