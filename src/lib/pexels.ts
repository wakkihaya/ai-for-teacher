export async function searchPexelsImage(word: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(word)}&per_page=1&orientation=square`,
      { headers: { Authorization: apiKey } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.photos?.[0]?.src?.medium ?? null
  } catch {
    return null
  }
}
