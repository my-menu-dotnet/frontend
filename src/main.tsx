import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "@/index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { OAUTH_GOOGLE_CLIENT_ID } from "./const/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { routeTree } from "./routeTree.gen";
import { AuthProvider } from "./hooks/useAuth";

const router = createRouter({ routeTree });

const queryClient = new QueryClient({});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={OAUTH_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  );
}
