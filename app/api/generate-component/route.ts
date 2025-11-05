import { openai } from "@/lib/ai/openai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { prompt, typography, palette, useDesignSystem } = await req.json();

    // --- 🧩 Validate inputs
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (useDesignSystem) {
      // check if user has design system data
      const hasPalette = palette && Object.keys(palette).length > 0;
      const hasTypography = typography && Object.keys(typography).length > 0;

      if (!hasPalette || !hasTypography) {
        return NextResponse.json(
          {
            error:
              "To enable Design System, please generate both a color palette and typography first.",
          },
          { status: 400 }
        );
      }
    }

    let techStack =
      "Next.js (App Router), TypeScript, Tailwind, Framer Motion, Lucide React, Shadcn UI";
    if (/HTML/i.test(prompt) && /CSS/i.test(prompt)) {
      techStack = "HTML, CSS, JS";
    }
    if (/REACT/i.test(prompt) && /TAILWIND/i.test(prompt)) {
      techStack = "REACT , TAILWIND CSS";
    }

    // --- 🧠 Build the AI prompt (proper interpolation)
    const promptTemplate = `
You are a senior front-end engineer and UI designer specializing in **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Lucide React**, and **Shadcn UI**.
Your task is to generate a **modern, responsive, and elegant UI component** aligned with the user's creative intent.

---

### 🧠 User Context
- **Prompt (Idea):** ${prompt}
- Tech Stack: ${techStack}
- **Color Palette:** ${
      useDesignSystem
        ? JSON.stringify(palette, null, 2)
        : "Use your own balanced and visually consistent color scheme."
    }
- **Typography:** ${
      useDesignSystem
        ? JSON.stringify(typography, null, 2)
        : "Use a clean, readable, and professional typography style."
    }

---

### 🎯 Design Requirements
⚠️ CRITICAL: Honor the user-specified tech stack exactly.
1. If the user requests "HTML, CSS, JS": "You must follow the user tech stack,
  Do NOT include React, Next.js, Tailwind, Framer Motion, or any other libraries".
2. If the user does not specify a stack, default to:  
   "Next.js (App Router), TypeScript, Tailwind, Framer Motion, Lucide React, Shadcn UI".
4. Ensure the component is **fully responsive**, **accessible (ARIA-friendly)**, and supports both **light and dark themes** (adapt via CSS variables or Tailwind classes as per stack).
5. Incorporate **smooth and tasteful transitions or animations** using **Framer Motion** (or CSS transitions if stack-limited).
7. Keep the design consistent with modern UI/UX standards - clean layout, balanced spacing, and readable contrast.
8. Follow best practices for **code structure, naming, and TypeScript typing** (omit typing if not TypeScript stack).

---

### ⚡ Output Rules
- **ONLY one file** in "codeFiles" array.
- Filename must match the component name .
- Do not generate index files, demo wrappers, or usage examples.
 ⚡ Additional Output Rule for previewCode:
- previewCode must include ONLY the JSX/TSX/JS of the main component.
- Do NOT include imports, exports, or any extra code.
- It should be copy-paste ready for rendering in a <div> or React component.


### 📦 Output Format
Return **only a valid JSON object**, no markdown, no explanations, exactly as follows:

{
  "description": "short description",
  "techStack": "<...>",
  "componentName": "...",
  "category": "...",
  "codeFiles": [
    { "filename": "...", "language": "<only extension>", "content": "..." }
  ],
  "previewCode": "..."
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Fixed: Use a valid OpenAI model; adjust as needed
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI that outputs ONLY valid JSON—no extra text.",
        },
        { role: "user", content: promptTemplate },
      ],
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content?.trim() || "";

    // Better JSON extraction: Handle potential markdown fences
    let jsonStr = result;
    if (result.startsWith("```json") && result.endsWith("```")) {
      jsonStr = result.slice(7, -3).trim();
    } else {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    }

    let component;
    try {
      component = JSON.parse(jsonStr);

      // Normalize newlines/tabs in code files
    } catch (err) {
      console.error("❌ Failed to parse component JSON:", err, jsonStr);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Component generated successfully.", component },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Internal error generating component:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
