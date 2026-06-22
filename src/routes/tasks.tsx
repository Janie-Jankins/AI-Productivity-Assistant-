import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ListChecks, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Break goals into prioritized task plans with AI." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("this week");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await run({ data: { goal, timeframe, context } });
      setOutput(res.text);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Turn a goal into a prioritized plan with milestones, effort estimates, and a schedule."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Input
              id="goal"
              required
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Launch the Q3 product update"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tf">Timeframe</Label>
            <Input
              id="tf"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              placeholder="e.g. by end of next month"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ctx">Context (optional)</Label>
            <Textarea
              id="ctx"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Team size, constraints, known dependencies…"
              className="min-h-[140px]"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Planning…" : "Create plan"}
          </Button>
        </form>

        <div>
          {output ? (
            <AiOutput text={output} title="Task plan" />
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Your task plan will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
