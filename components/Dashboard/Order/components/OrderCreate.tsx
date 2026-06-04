"use client";

import Button from "@/components/Button";
import { useState } from "react";
import { GoPlus } from "react-icons/go";
import OrderCreateModal from "./OrderCreateModal";

export default function OrderCreate() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        isIconOnly
        startContent={<GoPlus size={20} />}
        onPress={() => setIsOpen(true)}
        className="rounded-full"
        size="sm"
        data-test="add-manual-order"
      />

      <OrderCreateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
