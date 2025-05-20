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
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface ImprovementDatum {
  name: string;
  improvement: number;
}

function ImprovementChart() {
  const [data, setData] = useState<ImprovementDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/improvement");

        const formatted: ImprovementDatum[] = res.data.map(
          (p: { puzzle_id: string; improvement_seconds: number }) => ({
            name: `Puzzle ${parseInt(p.puzzle_id.replace("puzzle_", ""))}`,
            improvement: p.improvement_seconds,
          }),
        );

        setData(formatted);

        const summaryRes = await axios.post(
          "/api/generate-summary/improvement",
          {
            chartData: formatted,
          },
        );

        setSummary(summaryRes.data.summary);
      } catch (err) {
        console.error("Error fetching improvement data or summary:", err);
        setError("Failed to load chart or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="col-span-2 w-full">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Puzzle Improvement (Seconds Faster)
          </h2>
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
            columns={["Puzzle", "Improvement (s)"]}
            rows={data.map((d) => [d.name, d.improvement])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 16, right: 30, left: 0, bottom: 5 }}
            >
              {" "}
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="improvement"
                fill="#5c589d"
                name="Improvement (s)"
                radius={[4, 4, 0, 0]}
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

export default ImprovementChart;
