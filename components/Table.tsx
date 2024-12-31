import {
  Table as NextTable,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  TableProps as NextTableProps,
  TableBodyProps,
} from "@nextui-org/react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  InitialTableState,
  useReactTable,
} from "@tanstack/react-table";

type TableProps<T> = NextTableProps & {
  columns: ColumnDef<T>[];
  data: T[];
  initialState?: InitialTableState;
  bodyProps?: Omit<Omit<TableBodyProps<T>, "children">, "items">;
};

export default function Table<T>({
  columns,
  data,
  initialState,
  bodyProps,
  classNames,
  ...props
}: TableProps<T>) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: initialState,
  });

  return (
    <NextTable
      classNames={{
        wrapper: "shadow-none border",
        th: "uppercase",
        ...classNames,
      }}
      {...props}
    >
      <TableHeader
        columns={getHeaderGroups().flatMap((group) => group.headers)}
      >
        {(column) => (
          <TableColumn
            key={column.id}
            style={{ maxWidth: `${column.getSize()}px` }}
          >
            {flexRender(column.column.columnDef.header, column.getContext())}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={getRowModel().rows} {...bodyProps}>
        {(row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{ maxWidth: `${cell.column.getSize()}px` }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </NextTable>
  );
}
