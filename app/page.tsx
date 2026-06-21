import Link from "next/link"
import {
  MessageSquare,
  Phone,
  User,
  Settings,
  BookOpen,
  Mail,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: MessageSquare,
    label: "Chats",
    desc: "Real-time messaging, delivered instantly",
    href: "/chats",
  },
  {
    icon: Phone,
    label: "Calls",
    desc: "Audio and video, peer-to-peer",
    href: "/calls",
  },
  {
    icon: User,
    label: "Profile",
    desc: "Your identity across every conversation",
    href: "/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    desc: "Tune notifications, privacy, appearance",
    href: "/settings",
  },
]

const conversation = [
  { from: "them", text: "hey, you free for a call later?" },
  { from: "me", text: "yeah — 5pm work?" },
  { from: "them", text: "perfect, see you then" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ───────────────────────────────────────────────── */}
      <header className="border-b border-border">
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold">Wire</span>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            signal live
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white"
            >
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-medium text-indigo-400 tracking-wide uppercase mb-5">
            chat · calls · presence
          </p>
          <h1 className="text-5xl sm:text-6xl font-semibold leading-[1.05] mb-6 tracking-tight">
            Conversations,
            <br />
            without the lag.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-9 max-w-md">
            Messages land the instant you send them. Calls connect
            peer-to-peer, no relay in between. Built for the moments that
            can&apos;t wait.
          </p>
          <div className="flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-indigo-500 hover:bg-indigo-600 text-white group"
            >
              <Link href="/register" className="inline-flex items-center gap-2">
                Create an account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/login">I already have one</Link>
            </Button>
          </div>
        </div>

        {/* Signature element — live bubble exchange, styled like the login card */}
        <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-3 min-h-65 justify-end">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            sara — online
          </div>
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`text-sm px-4 py-2.5 rounded-2xl max-w-[75%] ${
                  msg.from === "me"
                    ? "bg-indigo-500 text-white rounded-br-sm"
                    : "bg-background text-foreground rounded-bl-sm border border-border"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-6">
          inside the app
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, label, desc, href }) => (
            <Link
              key={label}
              href={href}
              className="group bg-card border border-border hover:border-indigo-500/40 rounded-2xl p-5 transition-colors"
            >
              <Icon className="w-5 h-5 text-indigo-400 mb-4" strokeWidth={1.5} />
              <h3 className="font-medium text-sm mb-1.5">{label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}