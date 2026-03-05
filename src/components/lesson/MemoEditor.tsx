'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface MemoEditorProps {
  lessonId: string
  initialMemo: string | null
}

export function MemoEditor({ lessonId, initialMemo }: MemoEditorProps) {
  const [memo, setMemo] = useState(initialMemo ?? '')
  const [saving, setSaving] = useState(false)

  async function saveMemo() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('lessons')
      .update({ memo })
      .eq('id', lessonId)
    setSaving(false)
    if (error) {
      toast.error('Failed to save memo')
    } else {
      toast.success('Memo saved!')
    }
  }

  return (
    <div className="space-y-2 border rounded-lg p-4 bg-background">
      <Label htmlFor="memo" className="text-sm font-semibold">Teacher Memo</Label>
      <p className="text-xs text-muted-foreground">Private notes visible on the shared lesson page.</p>
      <Textarea
        id="memo"
        placeholder="Add notes, reminders, or context for this lesson…"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        rows={4}
      />
      <Button size="sm" onClick={saveMemo} disabled={saving}>
        {saving ? 'Saving…' : 'Save Memo'}
      </Button>
    </div>
  )
}
