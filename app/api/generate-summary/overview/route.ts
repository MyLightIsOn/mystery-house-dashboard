import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface CompletionDatum {
  name: string;
  completions: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chartData } = body;

    const chartString = chartData
      .map((d: CompletionDatum) => `${d.name}: ${d.completions} completions`)
      .join(", ");

    const prompt = `You are a friendly AI helping to analyze puzzle completion data from a haunted house accessibility training game. Here's the data: ${chartString}. Summarize the results in 2–3 sentences. Mention which puzzle was completed most and least, and whether there's a trend.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = chatResponse.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { message: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
