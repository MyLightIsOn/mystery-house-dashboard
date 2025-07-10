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

interface DeviceAnalytics {
  device_type: string;
  completion_count: number;
}

export async function GET() {
  try {
    // Read the puzzle_logs.json file
    const filePath = path.join(process.cwd(), "data", "puzzle_logs.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const puzzleLogs: PuzzleLog[] = JSON.parse(fileData);

    // Group by device_type and count completions
    const deviceCounts: Record<string, number> = {};

    puzzleLogs.forEach((log: PuzzleLog) => {
      const deviceType = log.device_type;
      if (!deviceCounts[deviceType]) {
        deviceCounts[deviceType] = 0;
      }
      deviceCounts[deviceType]++;
    });

    // Format the data as expected by the frontend
    const result: DeviceAnalytics[] = Object.entries(deviceCounts).map(
      ([device_type, completion_count]: [string, number]): DeviceAnalytics => ({
        device_type,
        completion_count
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("API fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
