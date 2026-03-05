import { Nav } from '@/components/Nav'
import { LessonWizard } from '@/components/wizard/LessonWizard'

export default function NewLessonPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Lesson</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Follow the steps to build a complete AI-powered lesson plan
          </p>
        </div>
        <LessonWizard />
      </main>
    </div>
  )
}
