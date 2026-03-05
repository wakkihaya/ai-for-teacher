'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { LessonNoteView } from './LessonNoteView'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { VocabWord } from '@/lib/types'

interface LessonNoteEditorProps {
  lessonId: string
  initialNote: string
  vocabulary?: VocabWord[] | null
}

export function LessonNoteEditor({ lessonId, initialNote, vocabulary }: LessonNoteEditorProps) {
  const [note, setNote] = useState(initialNote)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialNote)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('lessons').update({ lesson_note: draft }).eq('id', lessonId)
    setSaving(false)
    if (error) {
      toast.error('Failed to save lesson note')
    } else {
      setNote(draft)
      setEditing(false)
      toast.success('Lesson note saved!')
    }
  }

  function cancel() {
    setDraft(note)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="space-y-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={24}
          className="font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="outline" onClick={cancel} disabled={saving}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => { setDraft(note); setEditing(true) }}>
          Edit Note
        </Button>
      </div>
      <LessonNoteView lessonNote={note} vocabulary={vocabulary} />
    </div>
  )
}
