import { NextRequest, NextResponse } from 'next/server'
import { createOpenAIClient } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-openai-key')
  if (!apiKey) return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 401 })

  const { topic, language, lesson_plan, keyword } = await req.json()
  if (!lesson_plan) {
    return NextResponse.json({ error: 'Missing lesson_plan' }, { status: 400 })
  }

  const targetLanguage = language ?? 'French'
  const openai = createOpenAIClient(apiKey)

  const prompt = keyword
    ? `Generate exactly 10 ${targetLanguage} vocabulary words related to the theme "${keyword}" for a ${targetLanguage} language lesson about "${topic}".

For each word, provide:
- The word in ${targetLanguage}
- A simple English definition (1-2 sentences)
- An example sentence in ${targetLanguage} using the word in context

Return a JSON object with this structure:
{
  "vocabulary": [
    {
      "word": "${targetLanguage} word",
      "definition": "English definition",
      "example_sentence": "Example sentence in ${targetLanguage}"
    }
  ]
}`
    : `Extract exactly 10 key ${targetLanguage} vocabulary words from this lesson plan about "${topic}".

Lesson Plan:
${JSON.stringify(lesson_plan, null, 2)}

For each word, provide:
- The word in ${targetLanguage}
- A simple English definition (1-2 sentences)
- An example sentence in ${targetLanguage} using the word in context

Return a JSON object with this structure:
{
  "vocabulary": [
    {
      "word": "${targetLanguage} word",
      "definition": "English definition",
      "example_sentence": "Example sentence in ${targetLanguage}"
    }
  ]
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an expert vocabulary teacher for K-12 language students. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
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
