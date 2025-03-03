import Address from "@/components/Menu/Cart/Address";
import Checkout from "@/components/Menu/Cart/Checkout";
import CartSteps from "@/components/Menu/Cart/components/CartSteps";
import Email from "@/components/Menu/Cart/Email";
import { CartStepProvider } from "@/components/Menu/Cart/hooks/useCarStep";
import ItemsList from "@/components/Menu/Cart/ItemsList";
import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      <div className="px-4 py-6 flex items-center">
        <Link href={`/menu/${id}`}>
          <FaChevronLeft />
        </Link>
      </div>
      <CartStepProvider maxSteps={3}>
        <ItemsList />
        <Email />
        <Address />
        <Checkout />
      </CartStepProvider>
      {/* <CarBottomBar /> */}
    </div>
  );
}
