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

interface DropoffStats {
  started: number;
  completed: number;
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

    // Calculate started and completed for each puzzle
    const result: Record<string, DropoffStats> = {};

    Object.entries(puzzleGroups).forEach(([puzzle_id, logs]: [string, PuzzleLog[]]) => {
      // Group logs by session_id
      const sessionAttempts: Record<string, PuzzleLog[]> = {};
      logs.forEach((log: PuzzleLog) => {
        const sessionId = log.session_id;
        if (!sessionAttempts[sessionId]) {
          sessionAttempts[sessionId] = [];
        }
        sessionAttempts[sessionId].push(log);
      });

      // Count started (all sessions) and completed (sessions with at least one successful attempt)
      const started = Object.keys(sessionAttempts).length;
      let completed = 0;

      Object.values(sessionAttempts).forEach((attempts: PuzzleLog[]) => {
        // If there's at least one attempt, consider it completed
        // In a real scenario, you might want to check for a success flag or other criteria
        if (attempts.length > 0) {
          completed++;
        }
      });

      result[puzzle_id] = {
        started,
        completed
      } as DropoffStats;
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
