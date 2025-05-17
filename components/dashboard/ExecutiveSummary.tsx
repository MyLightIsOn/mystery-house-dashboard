import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExecutiveSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/analytics");
        const completions = res.data.completions_per_puzzle;

        const chartData = Object.entries(completions).map(
          ([puzzleId, count]) => ({
            name: `Puzzle ${puzzleId}`,
            completions: count,
          }),
        );

        setData(chartData);
      } catch (error) {
        console.error("Error fetching puzzle data:", error);
      }
    };

    fetchData().then((r) => console.log(r));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">
            Puzzle Completion Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completions" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
