"use client";

import { useCart } from "@/hooks/useCart";
import { redirect, useParams, useRouter } from "next/navigation";
import { BsCart3 } from "react-icons/bs";

export default function BottomBar() {
  const { items } = useCart();
  const router = useRouter();
  const params = useParams();
  const menuId = params.id;

  const handleCartClick = () => {
    router.push(`/menu/${menuId}/cart`);
  };

  return (
    <div
      className="fixed bottom-0 right-0 z-50 h-14 w-full bg-white shadow-2xl flex items-center justify-end px-6"
      style={{ boxShadow: "0px -2px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <div
        className="flex items-center gap-4 relative cursor-pointer"
        onClick={handleCartClick}
      >
        <BsCart3 size={30} className="fill-gray-400" />
        {items.length > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-sm">
            {items.length}
          </div>
        )}
      </div>
    </div>
  );
}
