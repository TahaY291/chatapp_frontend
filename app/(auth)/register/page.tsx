"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { registerUser } from "@/api/auth"

export default function RegisterPage() {
    const router = useRouter()
    const [form, setForm] = useState({ username: "", email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const requirements = [
        { label: "At least 8 characters",          met: form.password.length >= 8 },
        { label: "One uppercase letter",            met: /[A-Z]/.test(form.password) },
        { label: "One number",                      met: /[0-9]/.test(form.password) },
        { label: "One special character (!@#...)",  met: /[^a-zA-Z0-9]/.test(form.password) },
    ]

    const allMet = requirements.every(r => r.met)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!allMet) return
        setError("")
        setLoading(true)
        try {
            const res = await registerUser(form)
            if (res.statusCode === 201) {
                router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`)
            }
        } catch (error: any) {
            setError(error.response?.data?.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* username */}
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="John"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                            />
                        </div>

                        {/* email */}
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        {/* password */}
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => {
                                        setForm({ ...form, password: e.target.value })
                                        setError("")
                                    }}
                                />
                                {/* show/hide password toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {/* live requirements */}
                            {form.password.length > 0 && (
                                <ul className="text-xs space-y-1 mt-2">
                                    {requirements.map((req, i) => (
                                        <li
                                            key={i}
                                            className={req.met ? "text-green-500" : "text-red-500"}
                                        >
                                            {req.met ? "✓" : "✗"} {req.label}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* error message */}
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading || !allMet || !form.username || !form.email}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="underline text-foreground">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}