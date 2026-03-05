import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LessonNoteView } from '@/components/lesson/LessonNoteView'
import { Badge } from '@/components/ui/badge'
import type { Lesson } from '@/lib/types'

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('share_slug', slug)
    .eq('is_shared', true)
    .single()

  if (!lesson) notFound()

  const l = lesson as Lesson

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">Zina AI</span>
          <Badge variant="outline">Shared Lesson</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{l.title}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline">{l.grade_level}</Badge>
            <Badge variant="outline">{l.duration} min</Badge>
          </div>
        </div>

        {l.lesson_note ? (
          <LessonNoteView lessonNote={l.lesson_note} vocabulary={l.vocabulary} />
        ) : (
          <p className="text-muted-foreground">This lesson note is not yet available.</p>
        )}

        <p className="text-xs text-muted-foreground text-center pt-4 border-t">
          Created with Zina AI
        </p>
      </main>
    </div>
  )
}
