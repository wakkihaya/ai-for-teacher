'use client'

export function useApiKeys() {
  const getOpenAIKey = () =>
    typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') ?? '' : ''

  const getPexelsKey = () =>
    typeof window !== 'undefined' ? localStorage.getItem('pexels_api_key') ?? '' : ''

  const setOpenAIKey = (key: string) => localStorage.setItem('openai_api_key', key)
  const setPexelsKey = (key: string) => localStorage.setItem('pexels_api_key', key)

  const hasOpenAIKey = () => Boolean(getOpenAIKey())
  const hasPexelsKey = () => Boolean(getPexelsKey())

  return { getOpenAIKey, getPexelsKey, setOpenAIKey, setPexelsKey, hasOpenAIKey, hasPexelsKey }
}
