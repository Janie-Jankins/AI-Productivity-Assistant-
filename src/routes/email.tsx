import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"professional" | "friendly" | "concise" | "persuasive" | "apologetic">("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await run({ data: { recipient, purpose, tone, keyPoints } });
      setOutput(res.text);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe who you're writing to and what you need to say — the AI handles the rest."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]"
        >
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. My manager, Sarah from Acme"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Input
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request a 1-week deadline extension"
            />
          </div>
          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="kp">Key points (optional)</Label>
            <Textarea
              id="kp"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Bullet a few specifics the email should cover…"
              className="min-h-[120px]"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </form>

        <div>
          {output ? (
            <AiOutput text={output} title="Draft email" />
          ) : (
            <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Your AI-generated email will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
