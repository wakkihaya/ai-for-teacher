'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { LessonPlan, VocabWord } from '@/lib/types'

interface Step2Props {
  topic: string
  lessonPlan: LessonPlan
  onComplete: (vocabulary: VocabWord[]) => void
  onBack: () => void
}

export function Step2Vocabulary({ topic, lessonPlan, onComplete, onBack }: Step2Props) {
  const [words, setWords] = useState<VocabWord[]>([])
  const [loadingVocab, setLoadingVocab] = useState(true)
  const [loadingImages, setLoadingImages] = useState(false)

  useEffect(() => {
    generateVocab()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateVocab() {
    const apiKey = localStorage.getItem('openai_api_key')
    if (!apiKey) { toast.error('OpenAI key missing'); return }

    setLoadingVocab(true)
    try {
      const res = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-openai-key': apiKey },
        body: JSON.stringify({ topic, lesson_plan: lessonPlan }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      const vocab: VocabWord[] = await res.json()
      const withNullImages = vocab.map((v) => ({ ...v, image_url: null }))
      setWords(withNullImages)
      toast.success('Vocabulary extracted!')
      fetchImages(withNullImages)
    } catch (err) {
      toast.error(String(err))
    } finally {
      setLoadingVocab(false)
    }
  }

  async function fetchImages(vocab: VocabWord[]) {
    const pexelsKey = localStorage.getItem('pexels_api_key')
    if (!pexelsKey) return

    setLoadingImages(true)
    const updated = [...vocab]
    await Promise.all(
      vocab.map(async (v, i) => {
        try {
          const res = await fetch('/api/vocabulary-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-pexels-key': pexelsKey },
            body: JSON.stringify({ word: v.word }),
          })
          const data = await res.json()
          updated[i] = { ...updated[i], image_url: data.image_url }
        } catch {
          // ignore image errors
        }
      })
    )
    setWords([...updated])
    setLoadingImages(false)
  }

  function removeWord(index: number) {
    setWords((prev) => prev.filter((_, i) => i !== index))
  }

  if (loadingVocab) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">Extracting vocabulary from your lesson plan…</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {words.length} vocabulary words found.{' '}
          {loadingImages && 'Loading images…'}
          {!loadingImages && !localStorage.getItem('pexels_api_key') &&
            'Add a Pexels API key in Settings to get images.'}
        </p>
        <Button variant="outline" size="sm" onClick={generateVocab}>
          Regenerate
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {words.map((word, i) => (
          <Card key={i} className="overflow-hidden">
            {word.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={word.image_url}
                alt={word.word}
                className="w-full h-36 object-cover"
              />
            ) : (
              <div className="w-full h-36 bg-muted flex items-center justify-center text-3xl">
                📖
              </div>
            )}
            <CardContent className="p-3 space-y-1">
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-semibold text-sm">{word.word}</h3>
                <button
                  onClick={() => removeWord(i)}
                  className="text-muted-foreground hover:text-destructive text-xs shrink-0"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{word.definition}</p>
              <p className="text-xs italic text-muted-foreground">&ldquo;{word.example_sentence}&rdquo;</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button
          className="flex-1"
          onClick={() => onComplete(words)}
          disabled={words.length === 0}
        >
          Next: Create Lesson Note →
        </Button>
      </div>
    </div>
  )
}
