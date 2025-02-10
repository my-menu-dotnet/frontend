import { Food } from "@/types/api/Food";
import { FoodItemCategory } from "@/types/api/food/FoodItemCategory";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ItemCategoryModal from "./components/ItemCategoryModal";
import { FiEdit } from "react-icons/fi";
import { FoodItem as IFoodItem } from "@/types/api/food/FoodItem";
import ItemModal from "./components/ItemModa";
import Image from "next/image";
import { currency } from "@/utils/text";
import DraggableList from "@/components/DraggableList";
import { MdDragIndicator } from "react-icons/md";
import ItemList from "./components/ItemList";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

type FoodItemProps = {
  food: Food;
};

export default function FoodItem({ food }: FoodItemProps) {
  const [openCategory, setOpenCategory] = useState<boolean>(false);
  const [openItem, setOpenItem] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    FoodItemCategory | undefined
  >();
  const [selectedItem, setSelectedItem] = useState<IFoodItem | undefined>();

  const { mutate } = useMutation({
    mutationFn: (data: string[]) =>
      api.patch(`/food/${food.id}/category/order`, data),
  });

  const handleClickCategory = (category?: FoodItemCategory) => {
    setSelectedCategory(category);
    setOpenCategory(true);
  };

  const handleClickItem = (category: FoodItemCategory, item?: IFoodItem) => {
    setSelectedItem(item);
    setSelectedCategory(category);
    setOpenItem(true);
  };

  const handleCategoryOrder = (data: FoodItemCategory[]) => {
    const order = data.map((category) => category.id);
    mutate(order);
  };

  return (
    <div className="mt-6">
      <DraggableList
        droppableId="food-items-category"
        items={food.item_categories}
        onDragEnd={handleCategoryOrder}
        renderItem={(category, provided) => (
          <div className="mb-4" key={category.id}>
            <div
              onClick={() => handleClickCategory(category)}
              className="bg-gray-50 hover:bg-gray-100 transition-background py-4 flex gap-2 items-center rounded-md px-4 text-gray-800 cursor-pointer"
            >
              <div {...provided.dragHandleProps}>
                <MdDragIndicator />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <p>
                    {category.title} - {category.min_items} a{" "}
                    {category.max_items} itens
                  </p>
                  <p>{category.description}</p>
                </div>
                <FiEdit size={20} className="text-gray-400" />
              </div>
            </div>
            <div className="ml-4 mt-2">
              <ItemList category={category} onClickItem={handleClickItem} />
            </div>
          </div>
        )}
      />
      <div
        onClick={() => handleClickCategory()}
        className="border rounded-md w-full h-12 flex gap-2 justify-center items-center text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <FiPlus size={20} />
        <p>Adicionar categoria</p>
      </div>

      <ItemCategoryModal
        open={openCategory}
        onClose={() => setOpenCategory(false)}
        category={selectedCategory}
        foodId={food.id}
      />
      {selectedCategory && (
        <ItemModal
          open={openItem}
          onClose={() => setOpenItem(false)}
          item={selectedItem}
          categoryId={selectedCategory?.id || ""}
        />
      )}
    </div>
  );
}
