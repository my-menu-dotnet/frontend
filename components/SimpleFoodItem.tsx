import Image from "next/image";
import FoodDefault from "@/assets/default-food.jpg";
import { currency } from "@/utils/text";
import { GoPlus } from "react-icons/go";
import { BiMinus } from "react-icons/bi";
import { Discounts } from "@/types/api/Discounts";
import Price from "./Price";

type SimpleFoodItemProps = {
  title: string;
  description: string;
  price?: number;
  discount?: Partial<Discounts>;
  image?: string;
  onClickAdd?: () => void;
  onClickRemove?: () => void;
  total: number;
  hasIncrease?: boolean;
  hasPlus?: boolean;
  hasChangeQuantity?: boolean;
};

export default function SimpleFoodItem({
  title,
  description,
  discount,
  price,
  image,
  onClickAdd,
  onClickRemove,
  total,
  hasIncrease = true,
  hasChangeQuantity = true,
}: SimpleFoodItemProps) {
  return (
    <div className="flex items-center gap-2 h-24">
      <Image
        src={image || FoodDefault}
        alt="Imagem do item"
        className="object-contain"
        width={60}
        height={60}
        quality={100}
      />
      <div className="flex-1 w-full flex flex-col justify-between py-1">
        <div className="">
          <h4 className="">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {!!price && price !== 0 && (
          <div className="mt-2 text-sm">
            {hasIncrease && "+"}{" "}
            <Price price={price} discount={discount} discountIcon={false} />
          </div>
        )}
      </div>
      <div>
        {!!price && hasChangeQuantity && (
          <div className="flex flex-col items-center gap-1">
            <div
              onClick={() => onClickAdd && onClickAdd()}
              className="bg-gray-100 p-1 rounded-full flex items-center justify-center cursor-pointer
              "
            >
              <GoPlus />
            </div>
            {total}
            <div
              onClick={() => onClickRemove && onClickRemove()}
              className="bg-gray-100 p-1 rounded-full flex items-center justify-center cursor-pointer"
            >
              <BiMinus />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
