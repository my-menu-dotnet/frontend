"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import FoodModal from "@/components/Dashboard/Menu/Foods/FoodModal";
import FoodCard from "@/components/FoodCard";
import GlutenFree from "@/components/icons/GlutenFree";
import LactoseFree from "@/components/icons/LactoseFree";
import Vegan from "@/components/icons/Vegan";
import Vegetarian from "@/components/icons/Vegetarian";
import useCategory from "@/hooks/queries/useCategory";
import { Food } from "@/types/api/Food";
import { serrialize } from "@/utils/text";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
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
    <Block>
      <div className="w-full flex justify-end mb-4">
        <Button onPress={() => setOpenEdit({} as OpenEdit)}>
          <GoPlus size={24} />
          Adicionar
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {foodByCategory?.map(
          (category) =>
            category.foods &&
            category.foods.length > 0 && (
              <div key={category.id}>
                <div className="text-lg font-bold mb-4">{category.name}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {category.foods.map((food) => (
                    <FoodCard
                      key={food.id}
                      className="cursor-pointer"
                      food={food}
                      onClick={() =>
                        setOpenEdit({
                          food,
                          category_id: category.id,
                        })
                      }
                    />
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
    </Block>
  );
}
