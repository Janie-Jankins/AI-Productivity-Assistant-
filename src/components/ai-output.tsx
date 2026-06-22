import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Pencil, Eye, Check, AlertTriangle } from "lucide-react";

interface AiOutputProps {
  text: string;
  title?: string;
}

export function AiOutput({ text, title = "AI Output" }: AiOutputProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setValue(text);
    setEditing(false);
  }, [text]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
            {editing ? <Eye className="mr-1 h-3.5 w-3.5" /> : <Pencil className="mr-1 h-3.5 w-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onCopy}>
            {copied ? <Check className="mr-1 h-3.5 w-3.5" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="p-4">
        {editing ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[320px] font-mono text-sm"
          />
        ) : (
          <div className="prose-app">
            <ReactMarkdown>{value}</ReactMarkdown>
          </div>
        )}
      </div>
      <div className="flex items-start gap-2 border-t bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          AI-generated content. Verify accuracy, tone, and any factual claims before sharing or
          taking action.
        </span>
      </div>
    </div>
  );
}
