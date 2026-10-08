import Address from "@/components/Menu/Cart/Address";
import Checkout from "@/components/Menu/Cart/Checkout";
import Email from "@/components/Menu/Cart/Email";
import { CartStepProvider } from "@/components/Menu/Cart/hooks/useCarStep";
import ItemsList from "@/components/Menu/Cart/ItemsList";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FaChevronLeft } from "react-icons/fa";

export const Route = createFileRoute("/menu/$id/cart")({
  component: CartPage,
});

function CartPage() {
  const { id } = Route.useParams();

  return (
    <div>
      <div className="px-4 py-6 flex items-center">
        <Link to="/menu/$id" params={{ id }}>
          <FaChevronLeft />
        </Link>
      </div>
      <CartStepProvider maxSteps={3}>
        <ItemsList />
        <Email />
        <Address />
        <Checkout />
      </CartStepProvider>
    </div>
  );
}
