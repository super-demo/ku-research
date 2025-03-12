import { SignForm } from "@/app/sign/_components/sign-form"

export default function Page() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignForm />
      </div>
    </div>
  )
}
