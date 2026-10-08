import { isAxiosError } from "axios";

// Only the session endpoint's explicit onboarding response is actionable.
// Other precondition failures must remain errors for their own callers.
export function isMissingCompanyError(error: unknown): boolean {
  return (
    isAxiosError<{ message?: string }>(error) &&
    error.response?.status === 428 &&
    error.response.data?.message === "Account has no company"
  );
}
