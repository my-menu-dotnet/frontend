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
import FoodItem from "@/components/Dashboard/Food/FoodItem";

enum WIZARD_PAGES {
  ITEMS = "Itens",
  DATA = "Dados",
  DISCOUNTS = "Descontos",
}

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { data: food, refetch } = useFood(id);
  const [page, setPage] = useState<WIZARD_PAGES>(WIZARD_PAGES.ITEMS);

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
              <Tab
                key={WIZARD_PAGES.ITEMS}
                title={WIZARD_PAGES.ITEMS}
                className="ml-6"
              />
              <Tab key={WIZARD_PAGES.DATA} title={WIZARD_PAGES.DATA} />
              <Tab
                key={WIZARD_PAGES.DISCOUNTS}
                title={WIZARD_PAGES.DISCOUNTS}
              />
            </>
          }
          tabsProps={{
            onSelectionChange: (index) => setPage(index as WIZARD_PAGES),
            selectedKey: page,
          }}
        >
          {page === WIZARD_PAGES.ITEMS && <FoodItem food={food} />}
          {page === WIZARD_PAGES.DATA && (
            <FoodForm food={food} onSuccess={() => refetch()} />
          )}
          {page === WIZARD_PAGES.DISCOUNTS && <FoodDiscounts food={food} />}
        </Block>
      </>
    )
  );
}
