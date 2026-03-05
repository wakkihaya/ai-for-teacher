import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Nav } from '@/components/Nav'
import { LessonNoteView } from '@/components/lesson/LessonNoteView'
import { ShareButton } from '@/components/lesson/ShareButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lesson } from '@/lib/types'

export default async function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: lesson } = await supabase.from('lessons').select('*').eq('id', id).single()

  if (!lesson) notFound()

  const l = lesson as Lesson

  return (
    <div className="min-h-screen bg-muted/20">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">{l.title}</h1>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Badge variant="outline">{l.grade_level}</Badge>
              <Badge variant="outline">{l.duration} min</Badge>
              {l.is_shared && <Badge>Shared</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            {l.step_completed < 3 && (
              <Button variant="outline" asChild>
                <Link href="/lesson/new">Continue in wizard</Link>
              </Button>
            )}
            {l.lesson_note && (
              <ShareButton
                lessonId={l.id}
                shareSlug={l.share_slug}
                isShared={l.is_shared}
              />
            )}
          </div>
        </div>

        {l.lesson_note ? (
          <LessonNoteView lessonNote={l.lesson_note} vocabulary={l.vocabulary} />
        ) : l.lesson_plan ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Lesson plan created. Continue the wizard to generate vocabulary and the full lesson note.
            </p>
            <Card>
              <CardHeader><CardTitle className="text-base">Learning Objectives</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {l.lesson_plan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-muted-foreground">This lesson is empty.</p>
        )}
      </main>
    </div>
  )
}
