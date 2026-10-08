import { Category } from "@/types/api/Category";
import { DraggableProvided } from "@hello-pangea/dnd";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CategoryItemProps = {
  category: Category;
  onClickEdit: () => void;
  onClickDelete: () => void;
  provided: DraggableProvided;
};

const statusColorClass: Record<string, string> = {
  ACTIVE: "bg-green-500",
  INACTIVE: "bg-red-500",
};

const CategoryItem = ({
  category,
  onClickEdit,
  onClickDelete,
  provided,
}: CategoryItemProps) => {
  return (
    <div
      data-test="category-item"
      className="flex flex-row items-center gap-4 mt-2 px-4 h-12 shadow rounded-md"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div {...provided.dragHandleProps}>
        <RxHamburgerMenu />
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`w-3 h-3 rounded-full ${statusColorClass[category.status] ?? "bg-gray-400"}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {category.status === "ACTIVE" ? "Ativo" : "Inativo"}
        </TooltipContent>
      </Tooltip>
      <div className="flex-1">{category.name}</div>
      <div
        data-test="button-category-edit"
        onClick={onClickEdit}
        className="cursor-pointer"
      >
        <LuPencil className="text-gray-600" />
      </div>
      <div
        data-test="button-category-delete"
        onClick={onClickDelete}
        className="hover:bg-red-50 p-2 rounded-full cursor-pointer"
      >
        <FaRegTrashCan className="text-red-500" />
      </div>
    </div>
  );
};

export default CategoryItem;
