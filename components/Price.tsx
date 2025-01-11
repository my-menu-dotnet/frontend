import { Discounts } from "@/types/api/Discounts";
import { calculateDiscount } from "@/utils/discount";
import { currency } from "@/utils/text";

type PriceProps = {
  price: number;
  discount?: {
    discount: Discounts["discount"];
    type: Discounts["type"];
  };
  discountColor?: string;
};

export default function Price({ price, discount, discountColor }: PriceProps) {
  return (
    <>
      {discount?.discount ? (
        <>
          <div className="relative">
            <p className="absolute -top-3 text-xs text-gray-400 line-through">
              De {currency(price)}
            </p>
            <p>Por {currency(calculateDiscount({ price }, discount))}</p>
          </div>

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
        </>
      ) : (
        <div className="">{currency(price)}</div>
      )}
    </>
  );
}
