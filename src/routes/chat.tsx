import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessagesSquare, Send, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chat } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workplace AI" },
      { name: "description", content: "Chat with your AI workplace assistant." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const run = useServerFn(chat);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await run({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err: any) {
      toast.error(err?.message ?? "Chat failed");
      setMessages(next); // keep user msg
    } finally {
      setLoading(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-4xl flex-col">
      <PageHeader
        icon={MessagesSquare}
        title="AI Chatbot"
        description="Brainstorm, draft, plan, and decide — with conversation memory in this session."
      />

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] md:p-6"
      >
        {messages.length === 0 ? (
          <EmptyState onPick={(p) => setInput(p)} />
        ) : (
          <div className="space-y-5">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>Responses are AI-generated and may be inaccurate. Don't share sensitive data.</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-3 flex items-end gap-2 rounded-xl border bg-card p-2 shadow-[var(--shadow-card)]"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
          className="min-h-[52px] resize-none border-0 shadow-none focus-visible:ring-0"
          rows={2}
        />
        <Button type="submit" size="icon" disabled={loading || !input.trim()} className="shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}

function Bubble({ role, content }: Msg) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="prose-app min-w-0 flex-1 text-sm">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (p: string) => void }) {
  const prompts = [
    "Help me prep for a 1:1 with my manager about workload.",
    "Draft a Slack message announcing a project delay.",
    "Suggest an agenda for a 30-minute kickoff meeting.",
    "Explain OKRs to a new team member in plain language.",
  ];
  return (
    <div className="grid h-full place-items-center">
      <div className="max-w-md text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">How can I help today?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started:</p>
        <div className="mt-4 grid gap-2 text-left">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => onPick(p)}
              className="rounded-lg border bg-background px-3 py-2 text-sm text-foreground transition hover:border-primary/40 hover:bg-accent"
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
