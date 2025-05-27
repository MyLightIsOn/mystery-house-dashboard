"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import DataTable from "@/components/dashboard/DataTable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DeviceDatum {
  device: string;
  completions: number;
}

const COLORS = ["#8884d8", "#684646", "#418c65", "#ff7f50"];

function DevicePieChart() {
  const [data, setData] = useState<DeviceDatum[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [view, setView] = useState<"chart" | "table">("chart");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics/devices");
        const rawData = res.data;

        const grouped: Record<string, number> = {};
        rawData.forEach(
          (entry: { device_type: string; completion_count: number }) => {
            const device = entry.device_type;
            grouped[device] = (grouped[device] || 0) + entry.completion_count;
          },
        );

        const formatted: DeviceDatum[] = Object.entries(grouped).map(
          ([device, completions]) => ({ device, completions }),
        );

        setData(formatted);

        const summaryRes = await axios.post("/api/generate-summary/devices", {
          chartData: formatted,
        });

        setSummary(summaryRes.data.summary);
      } catch (err) {
        console.error("Error fetching device data or summary:", err);
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
          <h2 className="text-xl font-semibold">Completions by Device Type</h2>
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
            columns={["Device", "Completions"]}
            rows={data.map((d) => [d.device, d.completions])}
          />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="completions"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
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

export default DevicePieChart;
