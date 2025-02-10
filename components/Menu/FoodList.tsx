"use client";

import { Category } from "@/types/api/Category";
import { Menu } from "@/types/api/Menu";
import { Tab, Tabs } from "@nextui-org/react";
import { Montserrat } from "next/font/google";
import FoodCard from "../FoodCard";
import { Food } from "@/types/api/Food";
import { useState } from "react";
import FoodModal from "./components/FoodModal";

type FoodList = {
  menu: Menu;
  color: string;
};

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

export default function FoodList({ menu, color }: FoodList) {
  const [categories, setCategories] = useState<Category[]>(menu.categories);
  const [foodOpen, setFoodOpen] = useState<Food | undefined>();

  const handleTabsChange = (index: string) => {
    if (index === "ALL") {
      setCategories(menu.categories);
    } else {
      const category = menu.categories.find(
        (category) => category.id === index
      );
      setCategories([category!]);
    }
  };

  return (
    <>
      {menu.categories.length > 0 && (
        <Tabs
          aria-label="Options"
          className="mt-2 w-full"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "text-black " + montserrat.className,
          }}
          color="primary"
          variant="underlined"
          onSelectionChange={(index) => {
            handleTabsChange(index.toString());
          }}
        >
          <Tab
            key="ALL"
            title={
              <div className="flex items-center gap-2">
                <span>Todos</span>
              </div>
            }
          />
          {menu.categories.map((category) => (
            <Tab
              key={category.id}
              title={
                <div className="flex items-center gap-2">
                  <span>{category.name}</span>
                </div>
              }
            />
          ))}
        </Tabs>
      )}

      <div className="w-full">
        {categories.map(
          (category: Category) =>
            category.foods.length > 0 && (
              <section
                key={category.id}
                id={category.id}
                className="flex flex-col gap-4 mt-4"
              >
                <h2 className={montserrat.className}>{category.name}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.foods.map((product: Food) => (
                    <FoodCard
                      key={product.id}
                      food={product}
                      discountColor={color}
                      className="cursor-pointer"
                      onClick={() => setFoodOpen(product)}
                    />
                  ))}
                </ul>
              </section>
            )
        )}
      </div>

      <FoodModal food={foodOpen} onClose={() => setFoodOpen(undefined)} />
    </>
  );
}
