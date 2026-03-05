'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { LessonPlan } from '@/lib/types'

const GRADE_LEVELS = [
  'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
]

interface Step1Props {
  onComplete: (data: {
    title: string
    topic: string
    grade_level: string
    duration: number
    goals: string
    lesson_plan: LessonPlan
  }) => void
}

export function Step1LessonPlan({ onComplete }: Step1Props) {
  const [topic, setTopic] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [duration, setDuration] = useState(45)
  const [goals, setGoals] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LessonPlan | null>(null)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    const apiKey = localStorage.getItem('openai_api_key')
    if (!apiKey) {
      toast.error('Please set your OpenAI API key in Settings first.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-openai-key': apiKey },
        body: JSON.stringify({ topic, grade_level: gradeLevel, duration, goals }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const plan = await res.json()
      setResult(plan)
      toast.success('Lesson plan generated!')
    } catch (err) {
      toast.error(String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    if (!result) return
    onComplete({
      title: `${topic} — ${gradeLevel}`,
      topic,
      grade_level: gradeLevel,
      duration,
      goals,
      lesson_plan: result,
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="topic">Lesson Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Photosynthesis, World War II, Fractions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Grade Level</Label>
            <Select value={gradeLevel} onValueChange={setGradeLevel} required>
              <SelectTrigger>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_LEVELS.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration: {duration} minutes</Label>
            <input
              id="duration"
              type="range"
              min={15}
              max={120}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="goals">Learning Goals</Label>
          <Textarea
            id="goals"
            placeholder="What should students understand or be able to do by the end of this lesson?"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            rows={3}
            required
          />
        </div>
        <Button type="submit" disabled={loading || !gradeLevel}>
          {loading ? 'Generating…' : result ? 'Regenerate Plan' : 'Generate Lesson Plan'}
        </Button>
      </form>

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Warm-Up</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{result.warm_up}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Main Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.main_activities.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <Badge variant="outline" className="shrink-0 text-xs">{act.duration}m</Badge>
                  <div>
                    <p className="text-sm font-medium">{act.title}</p>
                    <p className="text-sm text-muted-foreground">{act.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Discussion Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-decimal list-inside space-y-1 text-sm">
                {result.discussion_questions.map((q, i) => <li key={i}>{q}</li>)}
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Assessment</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{result.assessment}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base">Homework</CardTitle></CardHeader>
              <CardContent><p className="text-sm">{result.homework}</p></CardContent>
            </Card>
          </div>

          <Button onClick={handleNext} className="w-full">
            Looks good — next: Vocabulary →
          </Button>
        </div>
      )}
    </div>
  )
}
