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
import LoadingButton from "@/components/custom/loading-button";

interface DropoffDatum {
  name: string;
  started: number;
  completed: number;
}

interface Values {
  started: number;
  completed: number;
}

type Data = {
  [key: string]: Values;
};

function DropoffChart() {
  const [data, setData] = useState<DropoffDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");
  const [summaryText, setSummaryText] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/dropoff");

        const formatted: DropoffDatum[] = Object.entries(res.data as Data).map(
          ([puzzleId, values]) => ({
            name: `Puzzle ${parseInt(puzzleId.replace("puzzle_", "")) + 1}`,
            started: values.started,
            completed: values.completed,
          }),
        );

        setData(formatted);
      } catch (err) {
        console.error("Error fetching dropoff data or summary:", err);
        setError("Failed to load chart or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateSummary = async () => {
    const summaryRes = await axios.post("/api/generate-summary/dropoff", {
      chartData: data,
    });

    setSummary(summaryRes.data.summary);
  };

  return (
    <Card className="col-span-2 w-full">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Puzzle Drop-off: Started vs Completed
          </h2>
          <ToggleGroup
            className={"border border-black"}
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
            columns={["Puzzle", "Started", "Completed"]}
            rows={data.map((d) => [d.name, d.started, d.completed])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{ top: 16, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                angle={-30}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="started"
                fill="#5c589d"
                name="Started"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="completed"
                fill="#6b6a85"
                name="Completed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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

export default DropoffChart;
