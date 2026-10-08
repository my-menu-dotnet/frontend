import Button from "@/components/Button";
import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Discounts } from "@/types/api/Discounts";
import { calculateDiscount } from "@/utils/discount";
import { discountsStatusColors, discountsStatusMasks } from "@/utils/lists";
import { currency } from "@/utils/text";
import { useParams } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FiPercent } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { MdAttachMoney } from "react-icons/md";
import DiscountsForm from "./components/DiscountsForm";
import useFood from "@/hooks/queries/food/useFood";
import { TiChevronRight } from "react-icons/ti";

const statusColorClass: Record<string, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  default: "bg-muted-foreground",
};

export default function FoodDiscounts() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: food } = useFood(id);
  const [open, setOpen] = useState<boolean | string>(false);

  const columns = useMemo<ColumnDef<Discounts, unknown>[]>(
    () => [
      {
        id: "status",
        maxSize: 35,
        cell: ({ row }) => {
          const color =
            statusColorClass[discountsStatusColors[row.original.status]] ||
            "bg-muted";
          return (
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex justify-center items-center rounded-full w-2 h-2 ${color}`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {discountsStatusMasks[row.original.status]}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
      {
        header: "Desconto",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-default">
                <span className="ml-1">
                  {row.original.type === "AMOUNT" &&
                    currency(row.original.discount)}
                  {row.original.type === "PERCENTAGE" &&
                    `${row.original.discount}%`}
                </span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Valor ou porcentagem de desconto aplicado ao produto
            </TooltipContent>
          </Tooltip>
        ),
      },
      {
        header: "Valor final",
        cell: ({ row }) =>
          food && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-yellow-500 text-white cursor-default">
                  <span className="ml-1">
                    {currency(calculateDiscount(food, row.original))}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Valor final do produto com desconto</TooltipContent>
            </Tooltip>
          ),
      },
      {
        header: "Tipo",
        cell: ({ row }) => {
          const isPercentage = row.original.type === "PERCENTAGE";
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  className={`${
                    isPercentage
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {isPercentage ? <FiPercent /> : <MdAttachMoney />}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Tipo de desconto aplicado:{" "}
                {isPercentage ? "Porcentagem" : "Valor"}
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        id: "open",
        maxSize: 35,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Button
              onClick={() => {
                setOpen(row.original.id);
              }}
              variant="ghost"
              size="icon"
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
            onClick={() => setOpen(true)}
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
          className="max-h-[200px] overflow-scroll"
          bodyProps={{
            emptyContent: "Nenhum desconto cadastrado",
          }}
        />
      </>
    )
  );
}
