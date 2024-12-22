"use client";

import useDiscounts from "@/hooks/queries/useDiscounts";
import api from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export default function Page() {
  const { data: discounts } = useDiscounts();

  return (
    <>
      {discounts?.map((discount) => (
        <div key={discount.id}></div>
      ))}
    </>
  );
}
