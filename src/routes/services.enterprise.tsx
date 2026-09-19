import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/enterprise")({
  head:()=>pageMeta("SaaS, APIs & Dashboards","Connected SaaS platforms, APIs, and dashboards for modern operations."),
  component: () => (
    <div><p className="text-xs font-bold uppercase text-accent">Service</p><h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-none">SaaS, APIs & Dashboards</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">We connect fragmented tools and data into products teams can understand, trust, and extend.</p><div className="mt-16 grid gap-px bg-border sm:grid-cols-2"><p className="bg-background p-7">Multi-tenant SaaS architecture</p><p className="bg-background p-7">APIs and third-party integrations</p><p className="bg-background p-7">Operational and customer dashboards</p><p className="bg-background p-7">Modernization of legacy systems</p></div></div>
  ),
});
