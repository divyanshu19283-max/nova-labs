import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => pageMeta("Services", "AI automation, AI agents, full-stack development, SaaS, APIs, and dashboards from TENURE AI."),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div><p className="text-xs font-bold uppercase text-accent">Capabilities</p><h1 className="mt-5 max-w-4xl font-display text-6xl font-semibold leading-none">From tangled operations to software that moves the business.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">We find the highest-leverage opportunity, prove it quickly, and build the production system around it.</p>
      <div className="mt-16 grid border-l border-t border-border md:grid-cols-2">
        {[
          { path: "/services/memory", label: "AI Automation & Agents", text:"Reliable workflows, grounded assistants, and human oversight for consequential work." },
          { path: "/services/governance", label: "Full-Stack Products", text:"Web and mobile experiences engineered around customer and team needs." },
          { path: "/services/enterprise", label: "SaaS, APIs & Dashboards", text:"Connected platforms, durable integrations, and operational visibility." },
        ].map((service) => (
          <Link
            key={service.path}
            to={service.path}
            className="group block min-h-64 border-b border-r border-border p-7 transition-colors hover:bg-secondary"
          >
            <h2 className="font-display text-3xl font-semibold">{service.label}</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{service.text}</p><ArrowRight className="mt-10 transition-transform group-hover:translate-x-1"/>
          </Link>
        ))}
      </div>
    </div>
  );
}
