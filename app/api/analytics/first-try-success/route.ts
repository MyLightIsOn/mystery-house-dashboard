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

interface FirstTrySuccess {
  puzzle_id: string;
  first_try_successes: number;
  success_rate_percent: number;
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

    // Calculate first try success for each puzzle
    const result: FirstTrySuccess[] = Object.entries(puzzleGroups).map(([puzzle_id, logs]: [string, PuzzleLog[]]) => {
      // Group logs by session_id to find first attempts
      const sessionAttempts: Record<string, PuzzleLog[]> = {};
      logs.forEach((log: PuzzleLog) => {
        const sessionId = log.session_id;
        if (!sessionAttempts[sessionId]) {
          sessionAttempts[sessionId] = [];
        }
        sessionAttempts[sessionId].push(log);
      });

      // Count first try successes (sessions with only one attempt)
      let firstTrySuccesses = 0;
      let totalSessions = Object.keys(sessionAttempts).length;

      Object.values(sessionAttempts).forEach((attempts: PuzzleLog[]) => {
        if (attempts.length === 1 && attempts[0].attempt_number === 1) {
          firstTrySuccesses++;
        }
      });

      // Calculate success rate
      const successRatePercent = totalSessions > 0
        ? Math.round((firstTrySuccesses / totalSessions) * 100)
        : 0;

      return {
        puzzle_id,
        first_try_successes: firstTrySuccesses,
        success_rate_percent: successRatePercent
      } as FirstTrySuccess;
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
