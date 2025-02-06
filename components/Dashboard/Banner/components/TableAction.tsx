import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { HiChevronDoubleRight } from "react-icons/hi";

type TableActionProps = {
  formId: string;
};

export default function TableAction({ formId }: TableActionProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/banners/${formId}`);
  };

  return (
    <div className="w-full flex justify-end">
      <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-md transition-background" onClick={handleClick}>
        <HiChevronDoubleRight size={20} className="text-gray-500" />
      </div>
    </div>
  );
}
