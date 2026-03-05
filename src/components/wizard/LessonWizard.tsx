'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { WizardProgress } from './WizardProgress'
import { Step1LessonPlan } from './Step1LessonPlan'
import { Step2Vocabulary } from './Step2Vocabulary'
import { Step3LessonNote } from './Step3LessonNote'
import type { LessonPlan, VocabWord } from '@/lib/types'

interface LessonData {
  id: string
  title: string
  topic: string
  grade_level: string
  duration: number
  goals: string
  lesson_plan: LessonPlan
  share_slug: string
}

export function LessonWizard() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [lessonData, setLessonData] = useState<LessonData | null>(null)
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([])

  async function handleStep1Complete(data: {
    title: string
    topic: string
    grade_level: string
    duration: number
    goals: string
    lesson_plan: LessonPlan
  }) {
    const supabase = createClient()
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        title: data.title,
        topic: data.topic,
        grade_level: data.grade_level,
        duration: data.duration,
        goals: data.goals,
        lesson_plan: data.lesson_plan,
        step_completed: 1,
      })
      .select()
      .single()

    if (error || !lesson) {
      toast.error('Failed to save lesson. Please try again.')
      return
    }

    setLessonData({ ...data, id: lesson.id, share_slug: lesson.share_slug })
    setStep(2)
  }

  async function handleStep2Complete(vocab: VocabWord[]) {
    if (!lessonData) return
    const supabase = createClient()
    await supabase
      .from('lessons')
      .update({ vocabulary: vocab, step_completed: 2 })
      .eq('id', lessonData.id)

    setVocabulary(vocab)
    setStep(3)
  }

  async function handleStep3Share() {
    if (!lessonData) return
    const supabase = createClient()
    await supabase
      .from('lessons')
      .update({ is_shared: true, step_completed: 3 })
      .eq('id', lessonData.id)
  }

  async function handleSaveLessonNote(markdown: string) {
    if (!lessonData) return
    const supabase = createClient()
    await supabase
      .from('lessons')
      .update({ lesson_note: markdown, step_completed: 3 })
      .eq('id', lessonData.id)
  }

  return (
    <div>
      <WizardProgress currentStep={step} />

      {step === 1 && (
        <Step1LessonPlan onComplete={handleStep1Complete} />
      )}

      {step === 2 && lessonData && (
        <Step2Vocabulary
          topic={lessonData.topic}
          lessonPlan={lessonData.lesson_plan}
          onComplete={handleStep2Complete}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && lessonData && (
        <Step3LessonNote
          topic={lessonData.topic}
          gradeLevel={lessonData.grade_level}
          lessonPlan={lessonData.lesson_plan}
          vocabulary={vocabulary}
          shareSlug={lessonData.share_slug}
          onShare={handleStep3Share}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
