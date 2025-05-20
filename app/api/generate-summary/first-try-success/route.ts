import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface FirstTryDatum {
  name: string;
  successRate: number;
  firstTry: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chartData: FirstTryDatum[] = body.chartData;

    const chartString = chartData
      .map(
        (d) =>
          `${d.name}: ${d.successRate}% success rate, ${d.firstTry} first try completions`,
      )
      .join("; ");

    const prompt = `You are analyzing user performance in a screen reader training game. Here's the first-try success data for each puzzle: ${chartString}. Write a brief summary highlighting which puzzles had the highest and lowest first-try success rates, any notable trends, and what this might suggest about difficulty.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI first-try summary error:", error);
    return NextResponse.json(
      { message: "Failed to generate first-try summary" },
      { status: 500 },
    );
  }
}
