import Button from "@/components/Button";
import Table from "@/components/Table";
import { Discounts } from "@/types/api/Discounts";
import { calculateDiscount } from "@/utils/discount";
import { discountsStatusColors, discountsStatusMasks } from "@/utils/lists";
import { currency } from "@/utils/text";
import { Chip, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { FiPercent } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { MdAttachMoney } from "react-icons/md";
import DiscountsForm from "./components/DiscountsForm";
import { useParams } from "next/navigation";
import useFood from "@/hooks/queries/food/useFood";
import { TiChevronRight } from "react-icons/ti";

export default function FoodDiscounts() {
  const { id } = useParams<{ id: string }>();
  const { data: food } = useFood(id);
  const [open, setOpen] = useState<boolean | string>(false);

  const columns = useMemo<ColumnDef<Discounts, unknown>[]>(
    () => [
      {
        id: "status",
        maxSize: 35,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Tooltip
                color={discountsStatusColors[row.original.status]}
                content={discountsStatusMasks[row.original.status]}
              >
                <div
                  className={`flex justify-center items-center rounded-full w-2 h-2 bg-${
                    discountsStatusColors[row.original.status]
                  }`}
                />
              </Tooltip>
            </div>
          );
        },
      },
      {
        header: "Desconto",
        cell: ({ row }) => (
          <Tooltip content="Valor ou porcentagem de desconto aplicado ao produto">
            <Chip size="sm" variant="flat">
              <p className="ml-1">
                {row.original.type === "AMOUNT" &&
                  currency(row.original.discount)}
                {row.original.type === "PERCENTAGE" &&
                  `${row.original.discount}%`}
              </p>
            </Chip>
          </Tooltip>
        ),
      },
      {
        header: "Valor final",
        cell: ({ row }) =>
          food && (
            <Tooltip content="Valor final do produto com desconto">
              <Chip size="sm" variant="flat" color="warning">
                <p className="ml-1">
                  {currency(calculateDiscount(food, row.original))}
                </p>
              </Chip>
            </Tooltip>
          ),
      },
      {
        header: "Tipo",
        cell: ({ row }) => (
          <Tooltip
            color={row.original.type === "PERCENTAGE" ? "danger" : "success"}
            content={`Tipo de desconto aplicado: ${
              row.original.type === "PERCENTAGE" ? "Porcentagem" : "Valor"
            }`}
          >
            <Chip
              size="sm"
              variant="flat"
              color={row.original.type === "PERCENTAGE" ? "danger" : "success"}
            >
              {row.original.type === "PERCENTAGE" ? (
                <FiPercent />
              ) : (
                <MdAttachMoney />
              )}
            </Chip>
          </Tooltip>
        ),
      },
      // {
      //   header: "Válido de",
      //   accessorFn: (row) =>
      //     row.start_at ? format(new Date(row.start_at), "dd/MM/yyyy") : "-",
      // },
      // {
      //   header: "Válido até",
      //   accessorFn: (row) =>
      //     row.end_at ? format(new Date(row.end_at), "dd/MM/yyyy") : "-",
      // },
      {
        id: "open",
        maxSize: 35,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Button
              onPress={() => {
                setOpen(row.original.id);
              }}
              isIconOnly
              variant="light"
              color="warning"
              size="sm"
            >
              <TiChevronRight size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [food?.discounts]
  );

  return (
    food && (
      <>
        <div className="flex justify-end mb-6">
          <Button
            onPress={() => setOpen(true)}
            startContent={<GoPlus size={24} />}
          >
            Adicionar
          </Button>
        </div>
        <DiscountsForm
          open={!!open}
          onClose={() => setOpen(false)}
          discountId={typeof open === "boolean" ? null : open}
        />
        <Table
          aria-label="Discounts"
          data={food?.discounts || []}
          columns={columns}
          classNames={{
            base: "max-h-[200px] overflow-scroll",
          }}
          bodyProps={{
            emptyContent: "Nenhum desconto cadastrado",
          }}
        />
      </>
    )
  );
}
