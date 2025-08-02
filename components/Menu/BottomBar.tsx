"use client";

import useOrdersUser from "@/hooks/queries/order/useOrdersUser";
import { useCart } from "@/hooks/useCart";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { BsCart3 } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { OrderStatus } from "../Dashboard/Order/OrderKanban";
import { useMenuCompany } from "@/hooks/useMenuCompany";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";
import { toast } from "react-toastify";

export default function BottomBar() {
  const { items } = useCart();
  const { data: orders } = useOrdersUser();
  const { company } = useMenuCompany();
  const { isOpen, status } = useBusinessStatus(company.business_hours);
  const router = useRouter();
  const params = useParams();
  const menuId = params.id;

  const handleCartClick = () => {
    if (!isOpen) {
      toast.error(`Não é possível fazer pedidos agora. ${status}.`);
      return;
    }
    router.push(`/menu/${menuId}/cart`);
  };

  const handleProfilClick = () => {
    router.push(`/menu/${menuId}/profile`);
  };

  const hasCreatedOrder = useMemo(() => {
    return orders?.content?.some(
      (order) => order.status === OrderStatus.CREATED
    );
  }, [orders]);

  return (
    <div
      className="fixed bottom-0 right-0 z-50 h-14 w-full bg-white shadow-2xl flex items-center justify-between px-6"
      style={{ boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <div
        className="flex items-center gap-4 relative cursor-pointer"
        onClick={handleProfilClick}
      >
        <FaRegUser size={26} className="fill-gray-400" />
        {hasCreatedOrder && (
          <div className="absolute -top-1 -right-0 w-3 h-3 bg-primary rounded-full flex items-center justify-center text-white text-sm"></div>
        )}
      </div>
      <div
        className={`flex items-center gap-4 relative cursor-pointer ${!isOpen ? 'opacity-50' : ''}`}
        onClick={handleCartClick}
      >
        <BsCart3 size={30} className="fill-gray-400" />
        {!isOpen && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            ×
          </div>
        )}
        {isOpen && items.length > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-sm">
            {items.length}
          </div>
        )}
      </div>
    </div>
  );
}
