import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface PuzzleLog {
  id: number;
  session_id: string;
  puzzle_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  attempt_number: number;
  device_type: string;
}

interface PuzzleStats {
  puzzle_id: string;
  completions: number;
  avg_duration_seconds: number;
}

interface OverviewResponse {
  puzzles: PuzzleStats[];
  totalCompletions: number;
  averageDuration: number;
  totalSessions: number;
}

export async function GET() {
  try {
    // Read the puzzle_logs.json file
    const filePath = path.join(process.cwd(), "data", "puzzle_logs.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const puzzleLogs: PuzzleLog[] = JSON.parse(fileData);

    // Group logs by puzzle_id
    const puzzleGroups: Record<string, PuzzleLog[]> = {};

    puzzleLogs.forEach((log: PuzzleLog) => {
      const puzzleId = log.puzzle_id;
      if (!puzzleGroups[puzzleId]) {
        puzzleGroups[puzzleId] = [];
      }
      puzzleGroups[puzzleId].push(log);
    });

    // Calculate completions and average duration for each puzzle
    const puzzles: PuzzleStats[] = Object.entries(puzzleGroups).map(([puzzle_id, logs]: [string, PuzzleLog[]]) => {
      // Count unique sessions as completions
      const uniqueSessions = new Set(logs.map(log => log.session_id));

      // Calculate average duration
      const totalDuration = logs.reduce((sum, log) => sum + log.duration_seconds, 0);
      const avgDuration = Math.round(totalDuration / logs.length);

      return {
        puzzle_id,
        completions: uniqueSessions.size,
        avg_duration_seconds: avgDuration
      };
    });

    // Calculate total completions
    const totalCompletions = puzzles.reduce((sum, puzzle: PuzzleStats) => sum + puzzle.completions, 0);

    // Calculate average duration
    const totalDuration = puzzleLogs.reduce((sum, log: PuzzleLog) => sum + log.duration_seconds, 0);
    const averageDuration = Math.round(totalDuration / puzzleLogs.length);

    // Calculate total unique sessions
    const uniqueSessions = new Set(puzzleLogs.map((log: PuzzleLog) => log.session_id));
    const totalSessions = uniqueSessions.size;

    const response: OverviewResponse = {
      puzzles,
      totalCompletions,
      averageDuration,
      totalSessions
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("API fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
