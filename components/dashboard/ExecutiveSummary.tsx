"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import CompletionChart from "@/components/dashboard/CompletionChart";
import DurationChart from "@/components/dashboard/DurationChart";
import DropoffChart from "@/components/dashboard/DropoffChart";
import ImprovementChart from "@/components/dashboard/ImprovementChart";

interface PuzzleStats {
  puzzle_id: string;
  completions: number;
  avg_duration_seconds: number;
}

interface DropoffStats {
  [key: string]: {
    started: number;
    completed: number;
  };
}

interface ImprovementStats {
  puzzle_id: string;
  improvement_seconds: number;
}

interface ChartDatum {
  name: string;
  completions?: number;
  avgDuration?: number;
  started?: number;
  completed?: number;
  improvement?: number;
}

export default function ExecutiveSummary() {
  const [completionData, setCompletionData] = useState<ChartDatum[]>([]);
  const [durationData, setDurationData] = useState<ChartDatum[]>([]);
  const [dropoffData, setDropoffData] = useState<ChartDatum[]>([]);
  const [improvementData, setImprovementData] = useState<ChartDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRes = await axios.get<{ puzzles: PuzzleStats[] }>(
          "/api/analytics",
        );
        const puzzleStats = analyticsRes.data.puzzles;

        const completions: ChartDatum[] = puzzleStats.map((p) => ({
          name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
          completions: p.completions,
        }));

        const durations: ChartDatum[] = puzzleStats.map((p) => ({
          name: `Puzzle ${p.puzzle_id.replace("puzzle_", "")}`,
          avgDuration: p.avg_duration_seconds,
        }));

        setCompletionData(completions);
        setDurationData(durations);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <CompletionChart data={completionData} />
      <DurationChart data={durationData} />
      <DropoffChart data={dropoffData} />
      <ImprovementChart data={improvementData} />
    </div>
  );
}
