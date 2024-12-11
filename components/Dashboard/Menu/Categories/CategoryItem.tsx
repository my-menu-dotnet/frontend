import { Category } from "@/types/api/Category";
import { DraggableProvided } from "@hello-pangea/dnd";
import { Tooltip } from "@nextui-org/react";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuPencil } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";

type CategoryItemProps = {
  category: Category;
  onClickEdit: () => void;
  onClickDelete: () => void;
  provided: DraggableProvided;
};

const CategoryItem = ({
  category,
  onClickEdit,
  onClickDelete,
  provided,
}: CategoryItemProps) => {
  return (
    <div
      className="flex flex-row items-center gap-4 mt-2 px-4 h-12 shadow rounded-md"
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div {...provided.dragHandleProps}>
        <RxHamburgerMenu />
      </div>
      <Tooltip content={category.status === "ACTIVE" ? "Ativo" : "Inativo"}>
        <div
          className={`w-3 h-3 rounded-full ${
            category.status === "ACTIVE" ? "bg-success" : "bg-danger"
          }`}
        />
      </Tooltip>
      <div className="flex-1">{category.name}</div>
      <div onClick={onClickEdit} className="cursor-pointer">
        <LuPencil className="text-gray-600" />
      </div>
      <div
        onClick={onClickDelete}
        className="hover:bg-danger-50 p-2 rounded-full cursor-pointer"
      >
        <FaRegTrashCan className="text-danger" />
      </div>
    </div>
  );
};

export default CategoryItem;
