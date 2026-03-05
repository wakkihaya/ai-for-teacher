import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">📚</div>
      <h2 className="text-xl font-semibold mb-2">No lesson plans yet</h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Create your first AI-powered lesson plan. It only takes a few minutes.
      </p>
      <Button asChild>
        <Link href="/lesson/new">Create your first lesson</Link>
      </Button>
    </div>
  )
}
