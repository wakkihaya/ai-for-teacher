import { NextRequest, NextResponse } from 'next/server'
import { createOpenAIClient } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-openai-key')
  if (!apiKey) return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 401 })

  const { topic, grade_level, duration, goals } = await req.json()
  if (!topic || !grade_level || !duration || !goals) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const openai = createOpenAIClient(apiKey)

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are an expert K-12 curriculum designer. Always respond with valid JSON.',
      },
      {
        role: 'user',
        content: `Create a detailed lesson plan for:
- Topic: ${topic}
- Grade Level: ${grade_level}
- Duration: ${duration} minutes
- Learning Goals: ${goals}

Return a JSON object with this exact structure:
{
  "objectives": ["string array of 3-4 learning objectives"],
  "warm_up": "string describing a 5-10 min warm-up activity",
  "main_activities": [
    { "title": "string", "description": "string", "duration": number_in_minutes }
  ],
  "discussion_questions": ["string array of 4-6 discussion questions"],
  "assessment": "string describing how to assess student understanding",
  "homework": "string describing optional homework assignment"
}`,
      },
    ],
  })

  const content = response.choices[0].message.content
  try {
    const lessonPlan = JSON.parse(content!)
    return NextResponse.json(lessonPlan)
  } catch {
    return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
  }
}
