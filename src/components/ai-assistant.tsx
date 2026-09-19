import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askAgencyAssistant } from "@/lib/agency.functions";

type Message = { role: "user" | "assistant"; content: string };
export function AiAssistant() {
  const ask = useServerFn(askAgencyAssistant);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "What would you like to build or improve?" }]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); const message = input.trim(); if (!message || busy) return;
    setInput(""); setBusy(true); setMessages((m) => [...m, { role: "user", content: message }]);
    try { const result = await ask({ data: { message } }); setMessages((m) => [...m, { role: "assistant", content: result.reply }]); }
    catch { setMessages((m) => [...m, { role: "assistant", content: "I couldn't respond just now. Please use Start a Project to reach the team." }]); }
    finally { setBusy(false); }
  }
  return <div className="fixed bottom-5 right-5 z-50">
    {open && <section className="mb-3 flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl" aria-label="AI assistant">
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="flex items-center gap-2 font-semibold"><Bot className="size-4 text-accent"/>Ask TENURE</div><Button variant="ghost" size="icon" aria-label="Close assistant" onClick={() => setOpen(false)}><X/></Button></div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((m,i) => <p key={i} className={`max-w-[88%] rounded-md px-3 py-2 text-sm leading-6 ${m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{m.content}</p>)}{busy && <p className="text-sm text-muted-foreground">Thinking…</p>}</div>
      <form onSubmit={submit} className="flex gap-2 border-t border-border p-3"><Input value={input} onChange={(e) => setInput(e.target.value)} maxLength={800} placeholder="Ask about our work…" aria-label="Message"/><Button size="icon" aria-label="Send message" disabled={busy}><Send/></Button></form>
    </section>}
    <Button size="icon" className="ml-auto size-12 rounded-full shadow-xl" aria-label="Open AI assistant" onClick={() => setOpen(!open)}><Bot/></Button>
  </div>;
}