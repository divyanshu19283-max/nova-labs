import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/governance")({
  head:()=>pageMeta("Full-Stack Development","Premium web and application development from product strategy through launch."),
  component: () => (
    <div><p className="text-xs font-bold uppercase text-accent">Service</p><h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-none">Full-Stack Development</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">From product definition to reliable production software, we build cohesive experiences without the handoff tax.</p><div className="mt-16 grid gap-px bg-border sm:grid-cols-2"><p className="bg-background p-7">Product strategy and prototyping</p><p className="bg-background p-7">Web and mobile application engineering</p><p className="bg-background p-7">Secure authentication and data systems</p><p className="bg-background p-7">Performance, accessibility, and launch</p></div></div>
  ),
});
