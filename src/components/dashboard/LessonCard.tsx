import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lesson } from '@/lib/types'

const STEP_LABELS = ['Not started', 'Plan created', 'Vocab ready', 'Complete']
const STEP_COLORS: Record<number, 'outline' | 'secondary' | 'default'> = {
  0: 'outline',
  1: 'outline',
  2: 'secondary',
  3: 'default',
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const date = new Date(lesson.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/lesson/${lesson.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">{lesson.title}</CardTitle>
            <Badge variant={STEP_COLORS[lesson.step_completed]} className="shrink-0 text-xs">
              {STEP_LABELS[lesson.step_completed]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{lesson.topic}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{lesson.grade_level}</span>
            <span>·</span>
            <span>{lesson.duration} min</span>
            <span>·</span>
            <span>{date}</span>
          </div>
          {lesson.is_shared && (
            <Badge variant="outline" className="text-xs">Shared</Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
