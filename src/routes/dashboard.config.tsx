import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/config")({
  component: ConfigPage,
});

function ConfigPage() {
  // Permission config UI is disabled in the original Next.js codebase (entire
  // body is commented out). Stub kept here so the route is type-safe and 200.
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-700">Configurações</h1>
      <p className="text-gray-500 mt-2">Em construção.</p>
    </div>
  );
}
