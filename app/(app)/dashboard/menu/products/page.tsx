"use client";

import Button from "@/components/Button";
import FoodModal from "@/components/Dashboard/Menu/Foods/FoodModal";
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

  const categories = {
    lactose_free: <LactoseFree width={20} height={20} />,
    gluten_free: <GlutenFree width={20} height={20} />,
    vegan: <Vegan width={20} height={20} />,
    vegetarian: <Vegetarian width={20} height={20} />,
  };

  return (
    <div>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {category.foods.map((food) => (
                    <div
                      key={food.id}
                      className="bg-white shadow rounded-md p-4 flex flex-col gap-2 cursor-pointer h-[200px]"
                      onClick={() =>
                        setOpenEdit({ food, category_id: category.id })
                      }
                    >
                      <div className="flex flex-row gap-4 h-full">
                        <Image
                          src={food.image.url}
                          alt={food.name}
                          width={200}
                          height={200}
                          className="rounded-md object-cover h-full w-2/5"
                        />
                        <div className="relative flex flex-col flex-1">
                          <div className="flex-1">
                            <div className="font-bold">{food.name}</div>
                            <p
                              className="line-clamp-3 text-gray-400 text-sm"
                              dangerouslySetInnerHTML={{
                                __html: serrialize(food.description),
                              }}
                            ></p>
                          </div>
                          <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-gap flex-row gap-2">
                              {Object.entries(categories).map(
                                ([key, value]) =>
                                  (food as any)[key] && <div key={key}>{value}</div>
                              )}
                            </div>
                            <div className="bg-primary text-white py-1 px-2 rounded-md">
                              <p className="font-bold text-sm">
                                R$ {food.price}
                              </p>
                            </div>
                          </div>
                          <div className="absolute top-0 right-0">
                            <Tooltip
                              content={
                                food.status === "ACTIVE" ? "Ativo" : "Inativo"
                              }
                            >
                              <div
                                className={`${
                                  food.status === "ACTIVE"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } text-white p-1 rounded-full`}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
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
