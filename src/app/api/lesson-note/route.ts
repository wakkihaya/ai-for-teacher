import { NextRequest, NextResponse } from "next/server";
import { createOpenAIClient } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-openai-key");
  if (!apiKey)
    return NextResponse.json(
      { error: "Missing OpenAI API key" },
      { status: 401 }
    );

  const { topic, grade_level, language, lesson_plan, vocabulary } = await req.json();
  const targetLanguage = language ?? 'French';
  if (!lesson_plan) {
    return NextResponse.json({ error: "Missing lesson_plan" }, { status: 400 });
  }

  const openai = createOpenAIClient(apiKey);

  const vocabList = vocabulary
    ? vocabulary
        .map(
          (v: { word: string; definition: string; example_sentence: string }) =>
            `- **${v.word}**: ${v.definition} (e.g., "${v.example_sentence}")`
        )
        .join("\n")
    : "";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          `You are an expert ${targetLanguage} language teacher creating clear, engaging lesson notes for students. Format everything as clean, well-structured markdown.`,
      },
      {
        role: "user",
        content: `Create a complete lesson note for students based on this ${targetLanguage} language lesson plan.

Topic: ${topic}
Grade Level: ${grade_level}
Lesson Language: ${targetLanguage}

Lesson Plan:
${JSON.stringify(lesson_plan, null, 2)}

Vocabulary Words:
${vocabList}

Write the lesson note content in ${targetLanguage}. Create a polished lesson note in markdown with these sections:
1. # [Lesson Title]
2. ## Learning Objectives
3. ## Key Vocabulary (word in ${targetLanguage} with English definition and example sentence in ${targetLanguage})
4. ## Lesson Content (expand the main activities into student-readable notes)
5. ## Discussion Questions
6. ## Homework

Make it engaging, clear, and appropriate for the grade level. Use bullet points, bold text, and good formatting.`,
      },
    ],
  });

  const markdown = response.choices[0].message.content;
  return NextResponse.json({ markdown });
}
