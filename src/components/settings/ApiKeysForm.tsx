'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ApiKeysForm() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [pexelsKey, setPexelsKey] = useState('')

  useEffect(() => {
    setOpenaiKey(localStorage.getItem('openai_api_key') ?? '')
    setPexelsKey(localStorage.getItem('pexels_api_key') ?? '')
  }, [])

  function handleSave() {
    localStorage.setItem('openai_api_key', openaiKey.trim())
    localStorage.setItem('pexels_api_key', pexelsKey.trim())
    toast.success('API keys saved!')
  }

  return (
    <div className="space-y-6 max-w-xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>OpenAI API Key</CardTitle>
            {openaiKey ? (
              <Badge variant="default" className="text-xs">Connected</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Not set</Badge>
            )}
          </div>
          <CardDescription>
            Required for AI lesson plan generation. Your key is stored only in your browser.{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Get your key →
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            placeholder="sk-..."
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Pexels API Key</CardTitle>
            {pexelsKey ? (
              <Badge variant="default" className="text-xs">Connected</Badge>
            ) : (
              <Badge variant="outline" className="text-xs">Not set</Badge>
            )}
          </div>
          <CardDescription>
            Optional. Used to find real images for vocabulary words.{' '}
            <a
              href="https://www.pexels.com/api/"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Get a free key →
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            type="password"
            placeholder="Your Pexels API key"
            value={pexelsKey}
            onChange={(e) => setPexelsKey(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save API Keys
      </Button>
    </div>
  )
}
