"use client";

import { Category } from "@/types/api/Category";
import Button from "../Button";
import { redirect } from "next/navigation";

type CategoriesProps = {
  categories: Category[];
  selected?: string;
};

export default function Categories({ categories, selected }: CategoriesProps) {
  return (
    <div className="flex flex-row gap-2 items-center mt-4">
      {categories.map((category, index) => (
        <Button
          key={index}
          variant={selected === category.name ? "solid" : "bordered"}
          className="border-1 h-8 px-6"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
