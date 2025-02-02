import { Discounts } from "@/types/api/Discounts";
import { Chip, Tooltip, User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { MdAttachMoney } from "react-icons/md";
import { FiPercent } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDelete } from "react-icons/md";
import { discountsStatusColors, discountsStatusMasks } from "@/utils/lists";
import { format } from "date-fns";
import { useMemo } from "react";
import useDiscounts from "@/hooks/queries/useDiscounts";
import { currency } from "@/utils/text";
import { calculateDiscount } from "@/utils/discount";
import Table from "@/components/Table";

type DiscountsTableProps = {
  setOpen: (open: string) => void;
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
        header: "Produto",
        cell: ({ row }) => (
          <div className="flex items-center gap-4">
            {row.original.food.image && (
              <User
                avatarProps={{
                  radius: "full",
                  src: row.original.food.image.url,
                }}
                name={row.original.food.name}
                description={row.original.food.description}
                classNames={{
                  description: "line-clamp-1",
                }}
              >
                {row.original.food.description}
              </User>
            )}
          </div>
        ),
      },
      {
        header: "Valor total",
        cell: ({ row }) => (
          <Tooltip content="Valor total do produto sem desconto">
            <Chip size="sm" variant="flat">
              <p className="ml-1">{currency(row.original.food.price)}</p>
            </Chip>
          </Tooltip>
        ),
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
        cell: ({ row }) => (
          <Tooltip content="Valor final do produto com desconto">
            <Chip size="sm" variant="flat" color="warning">
              <p className="ml-1">
                {currency(calculateDiscount(row.original.food, row.original))}
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
            <Tooltip content="Alterar desconto">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => setOpen(row.original.id)}
              >
                <CiEdit size={22} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Excluir desconto">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <MdOutlineDelete size={22} />
              </span>
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
