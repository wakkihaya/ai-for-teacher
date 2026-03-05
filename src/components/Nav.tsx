'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function Nav() {
  const router = useRouter()
  const [hasKeys, setHasKeys] = useState(false)

  useEffect(() => {
    const key = localStorage.getItem('openai_api_key')
    setHasKeys(Boolean(key))
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <nav className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          AI for Teacher
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button variant="ghost" size="sm" className="gap-2">
              <span
                className={`w-2 h-2 rounded-full ${hasKeys ? 'bg-green-500' : 'bg-muted-foreground'}`}
              />
              API Keys
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </nav>
  )
}
