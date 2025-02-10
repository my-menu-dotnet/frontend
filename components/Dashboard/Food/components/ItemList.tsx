import DraggableList from "@/components/DraggableList";
import api from "@/services/api";
import { FoodItem } from "@/types/api/food/FoodItem";
import { FoodItemCategory } from "@/types/api/food/FoodItemCategory";
import { currency } from "@/utils/text";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";

type ItemListProps = {
  category: FoodItemCategory;
  onClickItem: (category: FoodItemCategory, item?: FoodItem) => void;
};

export default function ItemList({ category, onClickItem }: ItemListProps) {
  const { mutate } = useMutation({
    mutationFn: (data: string[]) =>
      api.patch(`/food/category/${category.id}/item/order`, data),
  });

  const handleUpdateOrder = (data: FoodItem[]) => {
    const order = data.map((item) => item.id);
    mutate(order);
  };

  return (
    <>
      <DraggableList
        droppableId={category.id}
        items={category.food_items}
        onDragEnd={handleUpdateOrder}
        renderItem={(item, provided) => (
          <div
            key={item.id}
            className="flex gap-4 mb-2 border-b last:border-b-0 py-2 cursor-pointer"
            onClick={() => onClickItem(category, item)}
            {...provided.dragHandleProps}
          >
            <Image
              src={item.image?.url || ""}
              alt="Imagem do item"
              className="rounded-md"
              width={200}
              height={200}
            />
            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="">
                <h4 className="text-lg">{item.title}</h4>
                <p className="text-gray-400">{item.description}</p>
              </div>
              <p>{item.price_increase ? currency(item.price_increase) : ""}</p>
            </div>
          </div>
        )}
      />
      <div
        onClick={() => onClickItem(category)}
        className="border rounded-md w-full h-12 flex gap-2 justify-center items-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <FiPlus size={20} />
        <p>Adicionar item</p>
      </div>
    </>
  );
}
