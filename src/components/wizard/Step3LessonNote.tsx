'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { LessonPlan, VocabWord } from '@/lib/types'

interface Step3Props {
  topic: string
  gradeLevel: string
  lessonPlan: LessonPlan
  vocabulary: VocabWord[]
  shareSlug: string
  onShare: () => Promise<void>
  onBack: () => void
}

export function Step3LessonNote({
  topic,
  gradeLevel,
  lessonPlan,
  vocabulary,
  shareSlug,
  onShare,
  onBack,
}: Step3Props) {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    generateNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateNote() {
    const apiKey = localStorage.getItem('openai_api_key')
    if (!apiKey) { toast.error('OpenAI key missing'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/lesson-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-openai-key': apiKey },
        body: JSON.stringify({ topic, grade_level: gradeLevel, lesson_plan: lessonPlan, vocabulary }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const data = await res.json()
      setMarkdown(data.markdown)
      toast.success('Lesson note created!')
    } catch (err) {
      toast.error(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleShare() {
    setSharing(true)
    await onShare()
    const url = `${window.location.origin}/share/${shareSlug}`
    await navigator.clipboard.writeText(url)
    setShared(true)
    toast.success('Share link copied to clipboard!')
    setSharing(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Compiling your lesson note…</p>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-1/3' : i % 2 === 0 ? 'w-5/6' : 'w-full'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button variant="outline" size="sm" onClick={generateNote}>
          Regenerate
        </Button>
        <Button onClick={handleShare} disabled={sharing} className="ml-auto">
          {sharing ? 'Sharing…' : shared ? '✓ Link Copied!' : 'Share Lesson Note'}
        </Button>
      </div>

      {shared && (
        <div className="bg-muted rounded-lg p-3 text-sm">
          Share link:{' '}
          <span className="font-mono text-xs break-all">
            {typeof window !== 'undefined' ? `${window.location.origin}/share/${shareSlug}` : ''}
          </span>
        </div>
      )}

      {markdown && (
        <div className="prose prose-sm max-w-none border rounded-lg p-6 bg-background">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
