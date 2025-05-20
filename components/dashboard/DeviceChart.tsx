"use client";

import React, { useEffect, useState } from "react";
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
import axios from "axios";

interface DeviceStats {
  device_type: string;
  puzzle_id: string;
  average_duration_seconds: number;
  completion_count: number;
}

interface ChartDatum {
  name: string;
  duration: number;
  completions: number;
}

function DeviceComparisonChart() {
  const [data, setData] = useState<Record<string, ChartDatum[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<DeviceStats[]>("/api/analytics/devices");
        const grouped: Record<string, ChartDatum[]> = {};

        res.data.forEach((entry) => {
          const name = `Puzzle ${entry.puzzle_id.replace("puzzle_", "")}`;
          if (!grouped[entry.device_type]) grouped[entry.device_type] = [];

          grouped[entry.device_type].push({
            name,
            duration: entry.average_duration_seconds,
            completions: entry.completion_count,
          });
        });

        setData(grouped);
      } catch (error) {
        console.error("Error fetching device comparison data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {Object.entries(data).map(([device, chartData]) => (
        <Card key={device} className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {device} - Duration & Completions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="duration"
                  fill="#5c589d"
                  name="Avg Duration (s)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="completions"
                  fill="#82ca9d"
                  name="Completions"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default DeviceComparisonChart;
