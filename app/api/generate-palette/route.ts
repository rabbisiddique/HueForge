import { openai } from "@/lib/ai/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { colorPalette } = await req.json();

  if (!colorPalette) {
    return NextResponse.json({ error: "Prompt is missing!" }, { status: 400 });
  }
  const prompt = `
Generate a 6-color palette for the theme: "${colorPalette}".
Return the output strictly as a JSON array of objects, with each object containing:
[{
  "name": "<color name>",
  "hex": "<hex code>",
  "rgb": "<R, G, B>"
}]
Do NOT include any extra text, explanations, or comments.
`;

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b:free",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
  });

  const result = completion.choices[0].message.content?.trim() || "";
  try {
    const jsonMatch = result.match(/\[[\s\S]*\]/);

    const colors = JSON.parse(jsonMatch ? jsonMatch[0] : "[]");
    return NextResponse.json({
      message: "Palette generated successfully.",
      colors,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON output" }, { status: 500 });
  }
}
