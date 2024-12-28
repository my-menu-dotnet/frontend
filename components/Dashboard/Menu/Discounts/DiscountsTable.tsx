import { Discounts } from "@/types/api/Discounts";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

const columns: ColumnDef<Discounts>[] = [
  {
    header: "Status",
    accessorFn: (row) => (row.status === "ACTIVE" ? "Ativo" : "Inativo"),
  },
  {
    header: "Produto",
    accessorKey: "food.name",
  },
  {
    header: "Desconto",
    accessorFn: (row) => {
      if (row.type === "PERCENTAGE") {
        return `${row.discount}%`;
      }
      return `R$ ${row.discount}`;
    },
  },
  {
    header: "Tipo",
    accessorFn: (row) => (row.type === "PERCENTAGE" ? "Porcentagem" : "Valor"),
  },
  {
    header: "Válido de",
    accessorKey: "start_at",
  },
  {
    header: "Válido até",
    accessorKey: "end_at",
  },
];

type DiscountsTableProps = {
  discounts: Discounts[];
};

export default function DiscountsTable({ discounts }: DiscountsTableProps) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: discounts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table
      aria-label="Discounts"
      classNames={{ wrapper: "shadow-none border", th: "uppercase" }}
    >
      <TableHeader
        columns={getHeaderGroups().flatMap((group) => group.headers)}
      >
        {(column) => (
          <TableColumn key={column.id}>
            {flexRender(column.column.columnDef.header, column.getContext())}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={getRowModel().rows}>
        {(row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
