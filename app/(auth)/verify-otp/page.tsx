"use client"
import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import Link from "next/link"
import { resendOtp, verifyOtp } from "@/api/auth"
import { useAuthStore } from "@/store/authStore"

// ── component that actually calls useSearchParams ────────────────
function VerifyOTPForm() {
  const router = useRouter()
  const email = useSearchParams().get("email") ?? ""   // ← hook lives here
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState("Check your email")
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()
  console.log("email", email)

  const handleVerify = async () => {
    if (otp.length < 6) return
    if (!email) return
    setLoading(true)
    try {
      const res = await verifyOtp({ otp, email })
      if (res.status === 200) {
        setUser(res.data)
        router.push("/chats")
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid OTP")
      setTimeout(() => setMessage("Check your email"), 3000)
    } finally {
      setLoading(false)
    }
  }

  const resendOtpInCase = async () => {
    if (!email) return
    console.log("clicked")
    setLoading(true)
    try {
      const res = await resendOtp({ email })
      if (res.status === 200) setMessage("Otp resent successfuly")
    } catch (error) {
      setMessage("Failed to resend OTP — try again")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage("Check your email"), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{message}</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-5">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button className="w-full" onClick={handleVerify} disabled={loading || otp.length < 6}>
            {loading ? "Verifying..." : "Verify code"}
          </Button>
          <Button variant="outline" onClick={resendOtpInCase} className="w-full">
            Resend code
          </Button>
          <Link href="/register" className="text-sm text-muted-foreground hover:underline">
            ← Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

// ── default export — only wraps in Suspense, calls NO hooks itself ──
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <VerifyOTPForm />
    </Suspense>
  )
}