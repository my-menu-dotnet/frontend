import { Food } from "@/types/api/Food";
import Image from "next/image";
import Price from "./Price";
import { HTMLAttributes } from "react";
import FoodDefault from "@/assets/default-food.jpg";

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
      className={
        "relative flex items-center p-4 h-40 border rounded bg-white " +
        className
      }
      id={food.id}
      {...props}
    >
      <div className="flex-1 h-full flex flex-col justify-between">
        <div>
          <p className="text-md line-clamp-1">{food.name}</p>
          <p className="text-sm text-gray-400 line-clamp-2">
            {food.description}
          </p>
        </div>
        <Price
          discount={food.active_discount}
          price={food.price}
          discountColor={discountColor}
        />
      </div>
      <div className="h-full max-w-[40%]">
        <Image
          src={food.image?.url || FoodDefault}
          alt={food.name}
          width={200}
          height={200}
          className="object-cover rounded-md h-full"
        />
      </div>
    </li>
  );
}
