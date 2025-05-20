import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface DurationDatum {
  name: string;
  duration: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chartData: DurationDatum[] = body.chartData;

    const chartString = chartData
      .map((d) => `${d.name}: ${d.duration} seconds`)
      .join(", ");

    const prompt = `You're an AI assistant analyzing average completion times for puzzles in an accessibility-themed game. Here's the data: ${chartString}. Write a concise summary noting which puzzles took the longest and shortest, and any patterns you observe.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI duration summary error:", error);
    return NextResponse.json(
      { message: "Failed to generate duration summary" },
      { status: 500 },
    );
  }
}
