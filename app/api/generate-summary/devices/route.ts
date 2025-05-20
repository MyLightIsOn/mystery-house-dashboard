import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface DeviceDatum {
  device: string;
  completions: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const chartData: DeviceDatum[] = body.chartData;

    const chartString = chartData
      .map((d) => `${d.device}: ${d.completions} completions`)
      .join("; ");

    const prompt = `You are summarizing device usage patterns in a mobile accessibility training game. Here's the data by device type: ${chartString}. Write a brief summary comparing performance across device types and identifying which platform had more completions.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const summary = response.choices[0].message.content;
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("OpenAI device summary error:", error);
    return NextResponse.json(
      { message: "Failed to generate device summary" },
      { status: 500 },
    );
  }
}
