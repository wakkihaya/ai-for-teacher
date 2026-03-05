import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LessonCard } from '@/components/dashboard/LessonCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { Nav } from '@/components/Nav'
import type { Lesson } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-muted/20">
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Lessons</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {lessons?.length ?? 0} lesson{(lessons?.length ?? 0) !== 1 ? 's' : ''}
            </p>
          </div>
          <Button asChild>
            <Link href="/lesson/new">+ New Lesson</Link>
          </Button>
        </div>

        {!lessons || lessons.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson: Lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
