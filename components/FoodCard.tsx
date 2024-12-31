import { Food } from "@/types/api/Food";
import { serrialize } from "@/utils/text";
import { Tooltip } from "@nextui-org/react";
import Image from "next/image";
import GlutenFree from "./icons/GlutenFree";
import Price from "./Price";
import Vegetarian from "./icons/Vegetarian";
import Vegan from "./icons/Vegan";
import LactoseFree from "./icons/LactoseFree";
import { HTMLAttributes } from "react";

type FoodCardProps = HTMLAttributes<HTMLLIElement> & {
  food: Food;
  discountColor?: string;
};

export default function FoodCard({
  food,
  discountColor,
  className,
  ...props
}: FoodCardProps) {
  return (
    <li
      className={`flex flex-col bg-white shadow rounded-md relative ${className}`}
      {...props}
    >
      <Image
        src={food.image.url}
        alt={food.name}
        width={400}
        height={300}
        className="object-cover h-44 w-full"
      />
      <div className="w-full flex flex-col mt-2 px-4 py-2">
        <div className="flex-1">
          <h3 className="font-semibold">{food.name}</h3>
          <p
            className="line-clamp-3 text-gray-400 text-sm"
            dangerouslySetInnerHTML={{
              __html: serrialize(food.description),
            }}
          ></p>
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          <div className="flex flex-row gap-2 text-gray-400">
            {food.gluten_free && (
              <Tooltip content="Sem glúten">
                <GlutenFree width={24} height={24} />
              </Tooltip>
            )}
            {food.lactose_free && (
              <Tooltip content="Sem lactose">
                <LactoseFree width={24} height={24} />
              </Tooltip>
            )}
            {food.vegan && (
              <Tooltip content="Vegano">
                <Vegan width={24} height={24} />
              </Tooltip>
            )}
            {food.vegetarian && (
              <Tooltip content="Vegetariano">
                <Vegetarian width={24} height={24} />
              </Tooltip>
            )}
          </div>
          <Price
            discount={food.active_discount}
            price={food.price}
            discountColor={discountColor}
          />
        </div>
      </div>
    </li>
  );
}
