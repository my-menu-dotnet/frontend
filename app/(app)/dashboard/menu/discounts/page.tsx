"use client";

import DiscountsForm from "@/components/Dashboard/Menu/Discounts/DiscountsForm";
import DiscountsTable from "@/components/Dashboard/Menu/Discounts/DiscountsTable";
import useDiscounts from "@/hooks/queries/useDiscounts";

export default function Page() {
  const { data: discounts } = useDiscounts();

  return discounts && (
    <>
      <DiscountsForm />
      <DiscountsTable discounts={discounts}/>
    </>
  );
}
