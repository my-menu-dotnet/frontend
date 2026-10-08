/**
 * Minimal Google Identity Services type declaration.
 * The real `@types/google.accounts` package is not installed, so we declare
 * just the surface used by `src/routes/auth.tsx` and
 * `components/Menu/Cart/Email.tsx`.
 */
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement | null,
            options?: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              text?: string;
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
            },
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export {};
