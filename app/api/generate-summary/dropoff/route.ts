import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface DropoffDatum {
  name: string;
  started: number;
  completed: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chartData: DropoffDatum[] = body.chartData;

    const chartString = chartData
      .map(
        (d) => `${d.name} - Started: ${d.started}, Completed: ${d.completed}`,
      )
      .join("; ");

    const prompt = `You're analyzing drop-off patterns from an accessibility game. Each puzzle has a number of sessions that started and completed it. Here's the data: ${chartString}. Write a short summary highlighting where drop-off was highest, lowest, and any trends or observations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI drop-off summary error:", error);
    return NextResponse.json(
      { message: "Failed to generate drop-off summary" },
      { status: 500 },
    );
  }
}
