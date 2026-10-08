import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/company/verify-email")({
  component: VerifyEmailPagePlaceholder,
});

function VerifyEmailPagePlaceholder() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-bold text-primary">Verifique seu email</h1>
      <p className="text-gray-600 mt-2">Stub — port completo em Wave 4</p>
    </div>
  );
}
