"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import DiscountsForm from "@/components/Dashboard/Menu/Discounts/DiscountsForm";
import DiscountsTable from "@/components/Dashboard/Menu/Discounts/DiscountsTable";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function Page() {
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
    <div className="overflow-hidden">
      <Block>
        <div className="flex justify-end mb-6">
          <Button
            onPress={() => handleOpen()}
            startContent={<GoPlus size={24} />}
          >
            Adicionar
          </Button>
        </div>
        <DiscountsTable setOpen={(formId) => handleOpen(formId)} />
      </Block>
      <DiscountsForm open={open} onClose={handleClose} discountId={formId} />
    </div>
  );
}
