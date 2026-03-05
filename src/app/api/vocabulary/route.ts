import { NextRequest, NextResponse } from 'next/server'
import { createOpenAIClient } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-openai-key')
  if (!apiKey) return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 401 })

  const { topic, lesson_plan } = await req.json()
  if (!lesson_plan) {
    return NextResponse.json({ error: 'Missing lesson_plan' }, { status: 400 })
  }

  const openai = createOpenAIClient(apiKey)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an expert vocabulary teacher for K-12 students. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: `Extract 6-8 key vocabulary words from this lesson plan about "${topic}".

Lesson Plan:
${JSON.stringify(lesson_plan, null, 2)}

Return a JSON object with this structure:
{
  "vocabulary": [
    {
      "word": "string",
      "definition": "simple, student-friendly definition (1-2 sentences)",
      "example_sentence": "a clear example sentence using the word in context"
    }
  ]
}`,
      },
    ],
  })

  const content = response.choices[0].message.content
  try {
    const parsed = JSON.parse(content!)
    const vocabulary = parsed.vocabulary ?? parsed
    return NextResponse.json(vocabulary)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }
}
