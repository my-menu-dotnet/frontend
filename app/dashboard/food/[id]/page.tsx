"use client";

import Block from "@/components/Block";
import FoodDiscounts from "@/components/Dashboard/Food/DiscountsList";
import FoodForm from "@/components/Dashboard/Food/FoodForm";
import useFood from "@/hooks/queries/food/useFood";
import { Tab } from "@nextui-org/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import FoodDefault from "@/assets/default-food.jpg";
import { format } from "date-fns";

type WIZARD_PAGES = "data" | "discounts";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: food, refetch } = useFood(id);
  const [page, setPage] = useState<WIZARD_PAGES>("data");

  return (
    food && (
      <>
        <Block className="flex flex-row gap-6 mb-2">
          <div>
            <Image
              src={food.image?.url || FoodDefault}
              alt={food.name}
              width={300}
              height={400}
              className="object-cover"
            />
          </div>
          <div className="flex-1 relative text-md">
            <h1 className="font-semibold text-lg">{food.name}</h1>
            <p className="line-clamp-3 text-gray-400">{food.description}</p>
            <p className="text-gray-400 mt-4">
              <span className="font-bold">Categoria:</span> {food.category.name}
            </p>
            <p className="text-gray-400">
              <span className="font-bold">Preço:</span> R${food.price}
            </p>
            <div className="absolute bottom-0 right-0">
              <p className="text-xs text-gray-400">
                Atualizado em:{" "}
                {format(new Date(food.updated_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
        </Block>
        <Block
          className="mb-4"
          tabs={
            <>
              <Tab key="data" title="Dados" className="ml-6" />
              <Tab key="discounts" title="Descontos" />
            </>
          }
          tabsProps={{
            onSelectionChange: (index) => setPage(index as WIZARD_PAGES),
            selectedKey: page,
          }}
        >
          {page === "data" && (
            <FoodForm food={food} onSuccess={() => refetch()} />
          )}
          {page === "discounts" && <FoodDiscounts food={food} />}
        </Block>
      </>
    )
  );
}
