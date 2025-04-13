import {
  Table as UiTable,
  TableHeader as UiTableHeader,
  TableBody as UiTableBody,
  TableHead as UiTableHead,
  TableRow as UiTableRow,
  TableCell as UiTableCell,
} from "@/components/_ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo } from "react";
import { Skeleton } from "./_ui/skeleton";
import { Page } from "@/@types/api/Page";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
} from "./_ui/pagination";

type TableProps<T> = {
  page: Page<T> | undefined;
  columns: ColumnDef<T>[];
  emptyMessage?: string;
  isLoading?: boolean;
};
function TableComponent<T>({
  page,
  columns,
  emptyMessage,
  isLoading,
}: TableProps<T>) {
  const table = useReactTable({
    data: page?.content || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <UiTable>
        <UiTableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <UiTableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <UiTableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </UiTableHead>
                );
              })}
            </UiTableRow>
          ))}
        </UiTableHeader>
        <UiTableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <UiTableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <UiTableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </UiTableCell>
                ))}
              </UiTableRow>
            ))
          ) : (
            <UiTableRow>
              <UiTableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {isLoading ? (
                  <Skeleton
                    className="h-4 w-1/2 mx-auto"
                    style={{ width: "50%" }}
                  />
                ) : (
                  <p>{emptyMessage || "Nenhum dado encontrado."}</p>
                )}
              </UiTableCell>
            </UiTableRow>
          )}
        </UiTableBody>
      </UiTable>

      {/* {page?.page && page.page.total_pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            {Array.from({ length: page?.page.total_pages }, (_, index) => (
              <PaginationItem key={index}>{index + 1}</PaginationItem>
            ))}
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )} */}
    </>
  );
}

// Versão memoizada do componente
const Table = memo(TableComponent) as typeof TableComponent;

export default Table;
