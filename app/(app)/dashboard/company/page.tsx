import Block from "@/components/Block";
import CompanyForm from "@/components/CompanyForm";

export default function Page() {
  return (
    <main className="flex justify-center w-full">
      <Block className="max-w-full xl:max-w-[90%] w-full">
        <CompanyForm />
      </Block>
    </main>
  );
}
