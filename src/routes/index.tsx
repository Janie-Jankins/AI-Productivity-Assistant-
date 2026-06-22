import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessagesSquare, Sparkles, ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      { name: "description", content: "Your AI workplace productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const features = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft professional emails from a few key points.", icon: Mail, accent: "from-sky-500/20 to-indigo-500/20" },
  { to: "/meetings", title: "Meeting Notes Summarizer", desc: "Turn raw notes into clear summaries and action items.", icon: FileText, accent: "from-violet-500/20 to-fuchsia-500/20" },
  { to: "/tasks", title: "AI Task Planner", desc: "Break goals into prioritized, actionable plans.", icon: ListChecks, accent: "from-emerald-500/20 to-teal-500/20" },
  { to: "/research", title: "AI Research Assistant", desc: "Get structured briefings on any topic.", icon: Search, accent: "from-amber-500/20 to-orange-500/20" },
  { to: "/chat", title: "AI Chatbot", desc: "Ask anything — brainstorm, plan, draft, decide.", icon: MessagesSquare, accent: "from-pink-500/20 to-rose-500/20" },
] as const;

const stats = [
  { label: "Faster drafting", value: "10×", icon: Zap },
  { label: "Hours saved / week", value: "6+", icon: Clock },
  { label: "Privacy-aware", value: "100%", icon: ShieldCheck },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)] md:p-10 ring-grad animate-fade-up">
        <div className="absolute inset-0 -z-10 bg-mesh opacity-70" />
        <div className="absolute -top-24 -right-24 -z-10 h-72 w-72 rounded-full bg-[image:var(--gradient-primary)] opacity-20 blur-3xl animate-float" />
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          AI Productivity Suite
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
          Get more done with your{" "}
          <span className="text-gradient">AI co-worker.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Generate emails, summarize meetings, plan tasks, run research, and chat — all in one
          clean workspace built for professionals.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/chat"
            className="group inline-flex items-center gap-2 rounded-md bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
          >
            Start chatting
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-md border bg-background/80 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-accent"
          >
            Draft an email
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border bg-background/60 px-4 py-3 backdrop-blur">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-semibold leading-none">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Your toolkit</h2>
            <p className="text-sm text-muted-foreground">Five focused assistants, one workspace.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Link
              key={f.to}
              to={f.to}
              style={{ animationDelay: `${i * 60}ms` }}
              className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] animate-fade-up"
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground transition group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground group-hover:shadow-[var(--shadow-glow)]">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-semibold">{f.title}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 relative overflow-hidden rounded-xl border bg-card/70 p-5 text-sm text-muted-foreground ring-grad">
        <div className="absolute inset-0 -z-10 opacity-40 bg-mesh" />
        <div className="flex items-start gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p>
            <strong className="font-medium text-foreground">Responsible AI:</strong>{" "}
            Outputs are generated by AI and may be inaccurate, incomplete, or biased. Always review
            and edit before sending, sharing, or acting on them. Avoid entering confidential or
            regulated information unless your organization permits it.
          </p>
        </div>
      </section>
    </div>
  );
}
