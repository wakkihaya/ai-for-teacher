export interface LessonPlan {
  objectives: string[]
  warm_up: string
  main_activities: { title: string; description: string; duration: number }[]
  discussion_questions: string[]
  assessment: string
  homework: string
}

export interface VocabWord {
  word: string
  definition: string
  example_sentence: string
  image_url: string | null
}

export interface Lesson {
  id: string
  user_id: string
  title: string
  topic: string
  grade_level: string
  language: 'French' | 'Japanese'
  duration: number
  goals: string
  lesson_plan: LessonPlan | null
  vocabulary: VocabWord[] | null
  lesson_note: string | null
  is_shared: boolean
  share_slug: string
  step_completed: 0 | 1 | 2 | 3
  created_at: string
  updated_at: string
}
