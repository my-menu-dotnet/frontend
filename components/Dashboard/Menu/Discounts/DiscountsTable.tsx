import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Discounts } from "@/types/api/Discounts";
import { discountsStatusColors, discountsStatusMasks } from "@/utils/lists";
import { currency } from "@/utils/text";
import { calculateDiscount } from "@/utils/discount";
import Table from "@/components/Table";
import useDiscounts from "@/hooks/queries/useDiscounts";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";
import { FiPercent } from "react-icons/fi";
import { MdAttachMoney } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type DiscountsTableProps = {
  setOpen: (open: string) => void;
};

const statusColorClass: Record<string, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
  default: "bg-muted-foreground",
};

export default function DiscountsTable({ setOpen }: DiscountsTableProps) {
  const { data: discounts } = useDiscounts();
  const columns = useMemo<ColumnDef<Discounts, unknown>[]>(
    () => [
      {
        id: "status",
        accessorKey: "status",
        sortingFn: (rowA, rowB) => {
          const order = { ACTIVE: 1, PENDING: 2, INACTIVE: 3, EXPIRED: 4 };
          return order[rowA.original.status] - order[rowB.original.status];
        },
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
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            {row.original.food.image && (
              <div className="flex items-center gap-2">
                <Avatar className="rounded-full">
                  <AvatarImage src={row.original.food.image.url} />
                  <AvatarFallback>
                    {row.original.food.name?.[0]?.toUpperCase() ?? "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {row.original.food.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {row.original.food.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Valor total",
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="cursor-default">
                <span className="ml-1">
                  {currency(row.original.food.price)}
                </span>
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
        cell: ({ row }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-yellow-500 text-white cursor-default">
                <span className="ml-1">
                  {currency(calculateDiscount(row.original.food, row.original))}
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
        header: "Válido de",
        accessorFn: (row) =>
          row.start_at ? format(new Date(row.start_at), "dd/MM/yyyy") : "-",
      },
      {
        header: "Válido até",
        accessorFn: (row) =>
          row.end_at ? format(new Date(row.end_at), "dd/MM/yyyy") : "-",
      },
      {
        id: "actions",
        maxSize: 50,
        cell: ({ row }) => (
          <div className="relative flex items-center justify-end gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="text-lg text-muted-foreground cursor-pointer active:opacity-50"
                  onClick={() => setOpen(row.original.id)}
                >
                  <CiEdit size={22} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Alterar desconto</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-lg text-red-500 cursor-pointer active:opacity-50">
                  <MdOutlineDelete size={22} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Excluir desconto</TooltipContent>
            </Tooltip>
          </div>
        ),
      },
    ],
    [discounts]
  );

  return (
    <Table
      aria-label="Discounts"
      columns={columns}
      data={discounts || []}
      bodyProps={{
        emptyContent: "Nenhum desconto encontrado",
      }}
      initialState={{
        sorting: [
          {
            id: "status",
            desc: false,
          },
        ],
      }}
    />
  );
}
