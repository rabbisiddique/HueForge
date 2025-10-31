import { openai } from "@/lib/ai/openai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is missing!" },
        { status: 400 }
      );
    }

    const typographyPrompt = `
You are a professional typography generator.
Follow the instruction carefully and provide **3 different typography presets** according to the user prompt: "${prompt}".
Return **EXACTLY** in this JSON array format (array of presets). Each preset should include these fields:

[
  {
    "name": ["<typography name 1>", "<typography name 2>", "<typography name 3>"],
    "fontFamily": "<font family name>",
    "description": <description name>",
    "weight": <weight number>,
    "levels": [
      {
        "level": "Heading 1",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Heading 2",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Heading 3",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Heading 4",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Body Large",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Body",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Body Small",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      },
      {
        "level": "Caption",
        "size": "<size in px or rem>",
        "weight": <weight number>,
        "sample": "<text sample>"
            "fontFamily": "<font family name>",

      }
    ]
  }
]

Requirements:
- Return 1 presets in the array.
- "weight" must be a **number**.
- "description" must be 10 words
- Use valid CSS sizes for "size".
- "name" must be an array with 2–3 names.
- Return only JSON, nothing else.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: typographyPrompt }],
      temperature: 0.8,
    });

    const rawResult = completion.choices[0].message.content?.trim();
    if (!rawResult) throw new Error("Empty response from AI");

    const jsonStart = rawResult.indexOf("[");
    const jsonEnd = rawResult.lastIndexOf("]") + 1;
    if (jsonStart === -1 || jsonEnd === -1)
      throw new Error("No JSON array found");

    const jsonString = rawResult.slice(jsonStart, jsonEnd);
    const typographyPresets = JSON.parse(jsonString);

    return NextResponse.json(
      { message: "Typography generated successfully.", typographyPresets },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in generate typography:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
};
