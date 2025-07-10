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

interface ImprovementStats {
  puzzle_id: string;
  improvement_seconds: number;
}

export async function GET() {
  try {
    // Read the puzzle_logs.json file
    const filePath = path.join(process.cwd(), "data", "puzzle_logs.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const puzzleLogs: PuzzleLog[] = JSON.parse(fileData);

    // Group logs by puzzle_id and session_id
    const puzzleSessions: Record<string, Record<string, PuzzleLog[]>> = {};

    puzzleLogs.forEach((log: PuzzleLog) => {
      const puzzleId = log.puzzle_id;
      const sessionId = log.session_id;

      if (!puzzleSessions[puzzleId]) {
        puzzleSessions[puzzleId] = {};
      }

      if (!puzzleSessions[puzzleId][sessionId]) {
        puzzleSessions[puzzleId][sessionId] = [];
      }

      puzzleSessions[puzzleId][sessionId].push(log);
    });

    // Calculate improvement for each puzzle
    const result: ImprovementStats[] = Object.entries(puzzleSessions).map(([puzzle_id, sessions]: [string, Record<string, PuzzleLog[]>]) => {
      let totalImprovement = 0;
      let sessionsWithMultipleAttempts = 0;

      Object.values(sessions).forEach((attempts: PuzzleLog[]) => {
        // Sort attempts by attempt_number
        attempts.sort((a, b) => a.attempt_number - b.attempt_number);

        // Only consider sessions with multiple attempts
        if (attempts.length > 1) {
          const firstAttempt = attempts[0];
          const lastAttempt = attempts[attempts.length - 1];

          // Calculate improvement (first attempt duration - last attempt duration)
          const improvement = firstAttempt.duration_seconds - lastAttempt.duration_seconds;
          totalImprovement += improvement;
          sessionsWithMultipleAttempts++;
        }
      });

      // Calculate average improvement
      const averageImprovement = sessionsWithMultipleAttempts > 0
        ? Math.round(totalImprovement / sessionsWithMultipleAttempts)
        : 0;

      return {
        puzzle_id,
        improvement_seconds: averageImprovement
      } as ImprovementStats;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("API fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
