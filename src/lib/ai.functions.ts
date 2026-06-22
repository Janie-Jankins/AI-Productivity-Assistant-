import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const MODEL = "google/gemini-3-flash-preview";

async function runPrompt(system: string, prompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
  const gateway = createLovableAiGatewayProvider(key);
  try {
    const { text } = await generateText({
      model: gateway(MODEL),
      system,
      prompt,
    });
    return { text };
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    if (msg.includes("429")) throw new Error("Rate limit reached. Please try again in a moment.");
    if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in your workspace to continue.");
    throw new Error(msg);
  }
}

const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.enum(["professional", "friendly", "concise", "persuasive", "apologetic"]),
  keyPoints: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are an expert workplace communication assistant. Write clear, well-structured business emails. Output ONLY the email (subject line on first line as 'Subject: ...' then a blank line then the body). No preamble or commentary.";
    const prompt = `Recipient: ${data.recipient}
Purpose: ${data.purpose}
Tone: ${data.tone}
Key points to include:
${data.keyPoints || "(none specified)"}`;
    return runPrompt(system, prompt);
  });

const MeetingInput = z.object({
  notes: z.string().min(10),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You summarize meeting notes for busy professionals. Produce a clean markdown summary with these sections: ## Summary, ## Key Decisions, ## Action Items (as a checklist with owners if mentioned), ## Open Questions. Be concise and faithful to the source.";
    return runPrompt(system, data.notes);
  });

const TaskInput = z.object({
  goal: z.string().min(1),
  timeframe: z.string().optional().default("this week"),
  context: z.string().optional().default(""),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => TaskInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are an AI task planner. Break a goal into a prioritized, actionable plan. Output markdown with: ## Overview, ## Milestones, ## Tasks (numbered list, each with priority [High/Med/Low], estimated effort, and any dependencies), ## Suggested Schedule.";
    const prompt = `Goal: ${data.goal}
Timeframe: ${data.timeframe}
Context: ${data.context || "(none)"}`;
    return runPrompt(system, prompt);
  });

const ResearchInput = z.object({
  topic: z.string().min(1),
  depth: z.enum(["brief", "standard", "deep"]).default("standard"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system =
      "You are an AI research assistant for workplace professionals. Produce a structured markdown briefing with: ## Executive Summary, ## Background, ## Key Findings (bulleted), ## Considerations & Risks, ## Recommended Next Steps. Note when claims are general knowledge vs. needing verification.";
    const prompt = `Topic: ${data.topic}\nDepth: ${data.depth}`;
    return runPrompt(system, prompt);
  });

const ChatInput = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ).min(1),
});

export const chat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);
    try {
      const { text } = await generateText({
        model: gateway(MODEL),
        system:
          "You are a helpful AI workplace productivity assistant. Be concise, friendly, and practical. Use markdown formatting when helpful (lists, headings, code blocks).",
        messages: data.messages,
      });
      return { text };
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes("429")) throw new Error("Rate limit reached. Please try again in a moment.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in your workspace to continue.");
      throw new Error(msg);
    }
  });
