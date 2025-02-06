"use client";

import Block from "@/components/Block";
import Button from "@/components/Button";
import BannerTable from "@/components/Dashboard/Banner/BannerTable";
import CreateModal from "@/components/Dashboard/Banner/CreateModal";
import { useState } from "react";
import { GoPlus } from "react-icons/go";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Block>
        <div className="w-full flex justify-end mb-4">
          <Button onPress={() => setOpen(true)} data-test="add-food">
            <GoPlus size={24} />
            Adicionar
          </Button>
        </div>

        <BannerTable />

        <CreateModal open={open} onClose={() => setOpen(false)} />
      </Block>
    </>
  );
}
