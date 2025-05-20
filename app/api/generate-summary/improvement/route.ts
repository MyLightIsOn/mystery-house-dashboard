import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface ImprovementDatum {
  name: string;
  improvement: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chartData: ImprovementDatum[] = body.chartData;

    const chartString = chartData
      .map((d) => `${d.name}: ${d.improvement} seconds faster`)
      .join("; ");

    const prompt = `You are reviewing puzzle performance data from a screen reader training game. Each puzzle shows how much faster users completed it between their first and last attempt. Here's the data: ${chartString}. Write a brief summary that highlights the best and least improvements, and note any patterns.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI improvement summary error:", error);
    return NextResponse.json(
      { message: "Failed to generate improvement summary" },
      { status: 500 },
    );
  }
}
