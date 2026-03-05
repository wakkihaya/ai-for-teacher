'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  lessonId: string
  shareSlug: string
  isShared: boolean
}

export function ShareButton({ lessonId, shareSlug, isShared: initialShared }: ShareButtonProps) {
  const [isShared, setIsShared] = useState(initialShared)
  const [loading, setLoading] = useState(false)

  async function handleShare() {
    setLoading(true)
    const supabase = createClient()

    if (!isShared) {
      await supabase.from('lessons').update({ is_shared: true }).eq('id', lessonId)
      setIsShared(true)
    }

    const url = `${window.location.origin}/share/${shareSlug}`
    await navigator.clipboard.writeText(url)
    toast.success('Share link copied to clipboard!')
    setLoading(false)
  }

  async function handleUnshare() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('lessons').update({ is_shared: false }).eq('id', lessonId)
    setIsShared(false)
    toast.success('Lesson is now private.')
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleShare} disabled={loading}>
        {isShared ? 'Copy Share Link' : 'Share Lesson'}
      </Button>
      {isShared && (
        <Button variant="outline" onClick={handleUnshare} disabled={loading}>
          Make Private
        </Button>
      )}
    </div>
  )
}
