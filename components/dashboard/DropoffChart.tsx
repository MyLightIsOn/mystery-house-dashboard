import React, { useEffect, useState } from "react";
import { ChartDatum } from "@/types/ChartDatum";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { DropoffStats } from "@/types/DropoffStats";

function DropoffChart() {
  const [dropoffData, setDropoffData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
  );
}

export default DropoffChart;
