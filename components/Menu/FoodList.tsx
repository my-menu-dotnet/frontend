"use client";

import { Category } from "@/types/api/Category";
import { Menu } from "@/types/api/Menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FoodCard from "../FoodCard";
import { Food } from "@/types/api/Food";
import { useState } from "react";
import FoodModal from "./components/FoodModal";

type FoodList = {
  menu: Menu;
  color: string;
};

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
          defaultValue="ALL"
          onValueChange={handleTabsChange}
          className="mt-2 w-full"
        >
          <TabsList className="w-full justify-start gap-6 rounded-none border-b p-0 h-12">
            <TabsTrigger
              value="ALL"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-0"
            >
              <div className="flex items-center gap-2">
                <span>Todos</span>
              </div>
            </TabsTrigger>
            {menu.categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary px-0"
              >
                <div className="flex items-center gap-2">
                  <span>{category.name}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
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
                <h2 className="font-heading font-semibold">{category.name}</h2>
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

      <FoodModal
        food={foodOpen}
        onClose={() => setFoodOpen(undefined)}
        businessHours={menu.company.business_hours}
      />
    </>
  );
}
