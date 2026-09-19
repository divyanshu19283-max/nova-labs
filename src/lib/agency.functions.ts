import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  company: z.string().trim().max(120).default(""),
  service: z.enum(["AI Automation", "AI Agents", "Full-Stack Development", "SaaS & APIs", "Dashboards", "Not sure yet"]),
  budget: z.string().trim().max(60).default(""),
  message: z.string().trim().min(20).max(3000),
});

function clean(value: string) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim();
}

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new Error("Contact service is unavailable.");
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      } },
    });
    const { error } = await client.from("inquiries").insert({
      name: clean(data.name), email: data.email.toLowerCase(), company: clean(data.company),
      service: data.service, budget: clean(data.budget), message: clean(data.message),
    });
    if (error) throw new Error("We couldn't send your message. Please try again.");
    return { ok: true };
  });

const chatSchema = z.object({ message: z.string().trim().min(1).max(800) });

export const askAgencyAssistant = createServerFn({ method: "POST" })
  .inputValidator((input) => chatSchema.parse(input))
  .handler(async ({ data }) => {
    const text = clean(data.message).toLowerCase();
    if (/price|cost|budget|quote/.test(text)) return { reply: "Every engagement is scoped around outcomes and complexity. Share your goals through Start a Project and we’ll recommend a focused first phase." };
    if (/agent|assistant|rag|llm/.test(text)) return { reply: "We design production AI agents with clear permissions, grounded knowledge, human review, and measurable evaluation—not fragile demos." };
    if (/automat|workflow|n8n|zapier/.test(text)) return { reply: "We map the workflow first, then connect systems, add AI only where judgment helps, and keep human approvals around consequential actions." };
    if (/saas|api|dashboard|web|app|software/.test(text)) return { reply: "We build full-stack products, SaaS platforms, APIs, and operational dashboards with a strong focus on maintainability, security, and adoption." };
    if (/time|timeline|long|start/.test(text)) return { reply: "A focused discovery phase can start quickly. Delivery timing depends on scope; send the brief and we’ll return with a practical phased plan." };
    return { reply: "TENURE AI builds AI automation, agents, full-stack products, SaaS platforms, APIs, and dashboards. Tell me what you’re trying to improve, and I’ll point you to the right capability." };
  });