"use client";

import Button from "@/components/Button";
import DiscountsForm from "@/components/Dashboard/Menu/Discounts/DiscountsForm";
import DiscountsTable from "@/components/Dashboard/Menu/Discounts/DiscountsTable";
import useDiscounts from "@/hooks/queries/useDiscounts";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function Page() {
  const { data: discounts } = useDiscounts();
  const [open, setOpen] = useState<boolean>(false);
  const [formId, setFormId] = useState<string | null>(null);

  const handleOpen = (formId?: string | null) => {
    setOpen(true);
    setFormId(formId || null);
  };

  const handleClose = () => {
    setOpen(false);
    setFormId(null);
  };

  return (
    discounts && (
      <div className="overflow-hidden">
        <div className="flex justify-end mb-6">
          <Button
            onPress={() => handleOpen()}
            startContent={<GoPlus size={24} />}
          >
            Adicionar
          </Button>
        </div>
        <DiscountsForm open={open} onClose={handleClose} discountId={formId} />
        <DiscountsTable
          discounts={discounts}
          setOpen={(formId) => handleOpen(formId)}
        />
      </div>
    )
  );
}
