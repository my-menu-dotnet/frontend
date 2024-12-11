"use client";

import Button from "@/components/Button";
import FoodModal from "@/components/Dashboard/Menu/Foods/FoodModal";
import useCategory from "@/hooks/queries/useCategory";
import { Food } from "@/types/api/Food";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

type OpenEdit = {
  food: Food;
  category_id: string;
};

export default function Page() {
  const { data: foodByCategory } = useCategory();
  const [openEdit, setOpenEdit] = useState<OpenEdit | null>(null);

  return (
    <div>
      <div className="w-full flex justify-end mb-4">
        <Button onClick={() => setOpenEdit({} as OpenEdit)}>
          <GoPlus size={24} />
          Adicionar
        </Button>
      </div>

      <div>
        {foodByCategory?.map(
          (category) =>
            category.foods &&
            category.foods.length > 0 && (
              <div key={category.id}>
                <div className="text-lg font-bold">{category.name}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.foods.map((food) => (
                    <div
                      key={food.id}
                      className="bg-white shadow rounded-md p-4 flex flex-col gap-2"
                      onClick={() =>
                        setOpenEdit({ food, category_id: category.id })
                      }
                    >
                      <div className="font-bold">{food.name}</div>
                      <div>{food.description}</div>
                      <div>R$ {food.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      <FoodModal
        open={Boolean(openEdit)}
        onClose={() => setOpenEdit(null)}
        food={openEdit && openEdit?.food}
        category_id={openEdit && openEdit?.category_id}
      />
    </div>
  );
}
