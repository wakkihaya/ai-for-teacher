import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import type { VocabWord } from '@/lib/types'

interface LessonNoteViewProps {
  lessonNote: string
  vocabulary?: VocabWord[] | null
  showVocabCards?: boolean
  memo?: string | null
}

export function LessonNoteView({ lessonNote, vocabulary, showVocabCards = true, memo }: LessonNoteViewProps) {
  return (
    <div className="space-y-8">
      {showVocabCards && vocabulary && vocabulary.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Vocabulary Cards</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {vocabulary.map((word, i) => (
              <div key={i} className="border rounded-lg overflow-hidden bg-background">
                {word.image_url ? (
                  <div className="relative w-full h-32">
                    <Image
                      src={word.image_url}
                      alt={word.word}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-muted flex items-center justify-center text-3xl">
                    📖
                  </div>
                )}
                <div className="p-3 space-y-1">
                  <p className="font-semibold text-sm">{word.word}</p>
                  <p className="text-xs text-muted-foreground">{word.definition}</p>
                  <p className="text-xs italic text-muted-foreground">&ldquo;{word.example_sentence}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{lessonNote}</ReactMarkdown>
      </div>

      {memo && (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-1">
          <p className="text-sm font-semibold">Teacher Memo</p>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">{memo}</p>
        </div>
      )}
    </div>
  )
}
