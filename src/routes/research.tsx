import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      { name: "description", content: "Structured AI briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await run({ data: { topic, depth } });
      setOutput(res.text);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to run research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Get a structured briefing on any workplace topic — fast."
      />
      <form
        onSubmit={onSubmit}
        className="mb-6 grid gap-3 rounded-xl border bg-card p-4 shadow-[var(--shadow-card)] md:grid-cols-[1fr_auto_auto]"
      >
        <div className="space-y-1.5">
          <Label htmlFor="topic" className="sr-only">Topic</Label>
          <Input
            id="topic"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Best practices for async standups in distributed teams"
          />
        </div>
        <Select value={depth} onValueChange={(v) => setDepth(v as typeof depth)}>
          <SelectTrigger className="md:w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="brief">Brief</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="deep">Deep</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Researching…" : "Run research"}
        </Button>
      </form>

      {output ? (
        <AiOutput text={output} title="Research briefing" />
      ) : (
        <div className="grid min-h-[280px] place-items-center rounded-xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
          Your research briefing will appear here. Always verify factual claims with primary sources.
        </div>
      )}
    </div>
  );
}
