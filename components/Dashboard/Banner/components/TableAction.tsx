import { useNavigate } from "@tanstack/react-router";
import { HiChevronDoubleRight } from "react-icons/hi";

type TableActionProps = {
  formId: string;
};

export default function TableAction({ formId }: TableActionProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: `/dashboard/banners/${formId}` });
  };

  return (
    <div className="w-full flex justify-end">
      <div
        className="cursor-pointer hover:bg-muted p-1 rounded-md transition-background"
        onClick={handleClick}
      >
        <HiChevronDoubleRight size={20} className="text-muted-foreground" />
      </div>
    </div>
  );
}
