"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import CreateModal from "@/components/Dashboard/Food/CreateModal";
import FoodCard from "@/components/FoodCard";
import useCategory from "@/hooks/queries/useCategory";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function Page() {
  const router = useRouter();
  const { data: foodByCategory } = useCategory();
  const [open, setOpen] = useState(false);

  return (
    <Block>
      <div className="w-full flex justify-end mb-4">
        <Button onPress={() => setOpen(true)} data-test="add-food">
          <GoPlus size={24} />
          Adicionar
        </Button>
      </div>

      <div className="flex flex-col gap-6" data-test="food-container">
        {foodByCategory?.map(
          (category) =>
            category.foods &&
            category.foods.length > 0 && (
              <div key={category.id}>
                <div className="text-lg font-bold mb-4">{category.name}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {category.foods.map((food) => (
                    <FoodCard
                      data-test={`food-${food.name}`}
                      key={food.id}
                      className="cursor-pointer"
                      food={food}
                      onClick={() => router.push(`/dashboard/food/${food.id}`)}
                    />
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      <CreateModal open={open} onClose={() => setOpen(false)} />
    </Block>
  );
}
