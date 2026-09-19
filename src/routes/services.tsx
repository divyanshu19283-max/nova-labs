import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: () => (
    <div className="min-h-screen px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Outlet />
      </div>
    </div>
  ),
});
