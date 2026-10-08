import Block from "@/components/Block";
import CompanyForm from "@/components/CompanyForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/company")({
  component: DashboardCompanyPage,
});

function DashboardCompanyPage() {
  return (
    <main className="flex justify-center w-full">
      <Block className="max-w-full xl:max-w-[90%] w-full">
        <CompanyForm />
      </Block>
    </main>
  );
}
