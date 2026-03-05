import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">AI for Teacher</h1>
          <p className="mt-1 text-muted-foreground text-sm">Lesson plans powered by AI</p>
        </div>
        <SignupForm />
      </div>
    </main>
  )
}
