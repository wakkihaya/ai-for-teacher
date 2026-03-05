import { Nav } from '@/components/Nav'
import { ApiKeysForm } from '@/components/settings/ApiKeysForm'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your API keys. Keys are stored locally in your browser only.
          </p>
        </div>
        <ApiKeysForm />
      </main>
    </div>
  )
}
