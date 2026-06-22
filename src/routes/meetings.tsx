import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Summarize meetings into action items with AI." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await run({ data: { notes } });
      setOutput(res.text);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript — get a clean summary, decisions, and action items."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes / transcript</Label>
            <Textarea
              id="notes"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your meeting notes here…"
              className="min-h-[360px]"
            />
          </div>
          <Button type="submit" disabled={loading || notes.length < 10} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Summarizing…" : "Summarize meeting"}
          </Button>
        </form>

        <div>
          {output ? (
            <AiOutput text={output} title="Meeting summary" />
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Your structured summary will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
