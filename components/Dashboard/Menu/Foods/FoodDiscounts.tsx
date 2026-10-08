import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Discounts } from "@/types/api/Discounts";
import { Food } from "@/types/api/Food";
import { calculateDiscount } from "@/utils/discount";
import { discountsStatusColors, discountsStatusMasks } from "@/utils/lists";
import { currency } from "@/utils/text";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { FiPercent } from "react-icons/fi";
import { MdAttachMoney } from "react-icons/md";

type FoodDiscountsProps = {
  food: Food | null;
};

const statusColorClass: Record<string, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  default: "bg-muted-foreground",
};

export default function FoodDiscounts({ food }: FoodDiscountsProps) {
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
        header: "Produto",
        cell: () => (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="rounded-full">
                <AvatarImage src={food?.image?.url} />
                <AvatarFallback>
                  {food?.name?.[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{food?.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {food?.description}
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        header: "Valor total",
        cell: () =>
          food?.price && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-default">
                  <span className="ml-1">{currency(food?.price)}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Valor total do produto sem desconto
              </TooltipContent>
            </Tooltip>
          ),
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
              <TooltipContent>
                Valor final do produto com desconto
              </TooltipContent>
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
        header: "Válido de",
        accessorFn: (row) =>
          row.start_at ? format(new Date(row.start_at), "dd/MM/yyyy") : "-",
      },
      {
        header: "Válido até",
        accessorFn: (row) =>
          row.end_at ? format(new Date(row.end_at), "dd/MM/yyyy") : "-",
      },
    ],
    [food?.discounts]
  );

  return (
    food?.discounts &&
    food?.discounts.length > 0 && (
      <>
        <p className="mt-2 font-semibold text-gray-400">
          Histórico de Descontos
        </p>
        <Table
          aria-label="Discounts"
          data={food.discounts}
          columns={columns}
          classNames={{
            base: "max-h-[200px] overflow-scroll",
          }}
        />
      </>
    )
  );
}
