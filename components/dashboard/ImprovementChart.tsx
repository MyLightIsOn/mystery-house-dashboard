import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartDatum } from "@/types/ChartDatum";
import { ImprovementStats } from "@/types/ImprovementStats";
import axios from "axios";

function ImprovementChart() {
  const [improvementData, setImprovementData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const improvementRes = await axios.get<ImprovementStats[]>(
          "/api/analytics/improvement",
        );
        const improvement: ChartDatum[] = improvementRes.data.map((item) => ({
          name: `Puzzle ${item.puzzle_id.replace("puzzle_", "")}`,
          improvement: item.improvement_seconds,
        }));

        setImprovementData(improvement);
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
          Improvement Score (First vs Last Attempt)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={improvementData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="improvement" fill="#8884d8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default ImprovementChart;
