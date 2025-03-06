import { Discounts, DiscountsType } from "@/types/api/Discounts";
import { calculateDiscount } from "@/utils/discount";
import { currency } from "@/utils/text";
import { HTMLAttributes } from "react";

type PriceProps = HTMLAttributes<HTMLDivElement> & {
  price: number;
  discount?: Partial<Discounts>;
  discountIcon?: boolean;
  discountColor?: string;
};

export default function Price({
  price,
  discount,
  discountIcon = true,
  discountColor,
  ...props
}: PriceProps) {
  return (
    <div className="text-sm" {...props}>
      {discount?.discount && discount?.type ? (
        <>
          <div className="relative">
            <p className="absolute -top-3 text-xs text-gray-400 line-through">
              De {currency(price)}
            </p>
            <p>Por {currency(calculateDiscount({ price }, discount as { discount: number; type: DiscountsType }))}</p>
          </div>
          {discountIcon && (
            <div className="absolute z-10 -top-4 -right-4">
              <div
                className={`discount-icon flex items-center justify-center`}
                style={
                  {
                    "--discount-color":
                      discountColor ||
                      "hsl(var(--nextui-primary) / var(--nextui-primary-opacity, var(--tw-bg-opacity)))",
                  } as React.CSSProperties
                }
              >
                <span className={`text-[14px] z-30 text-white font-bold`}>
                  {discount?.type === "PERCENTAGE"
                    ? discount.discount + "%"
                    : currency(discount.discount)}
                </span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="">{currency(price)}</div>
      )}
    </div>
  );
}
