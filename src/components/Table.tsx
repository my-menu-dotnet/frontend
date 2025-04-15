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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./_ui/pagination";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

type TableProps<T> = {
  data: T[];
  total_pages?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  columns: ColumnDef<T>[];
  emptyMessage?: string;
  isLoading?: boolean;
  dragable?: boolean;
  onDragEnd?: (sourceIndex: number, destinationIndex: number) => void;
};
function TableComponent<T>({
  data,
  total_pages,
  page,
  onPageChange,
  columns,
  emptyMessage,
  isLoading,
  dragable,
  onDragEnd,
}: TableProps<T>) {
  const tableColumns = dragable
    ? [
        {
          id: "drag-handle",
          cell: () => (
            <div className="flex items-center justify-center w-8">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          ),
        } as ColumnDef<T>,
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data: data || [],
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleNextPage = () => {
    if (page !== undefined && total_pages && page < total_pages) {
      onPageChange?.(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page && page > 0) {
      onPageChange?.(page - 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

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
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination || !dragable) return;
            onDragEnd?.(result.source.index, result.destination.index);
          }}
        >
          <Droppable droppableId="droppable" isDropDisabled={!dragable}>
            {(droppableProvided, snapshot) => (
              <UiTableBody
                {...droppableProvided.droppableProps}
                ref={droppableProvided.innerRef}
                className={`${
                  snapshot.isDraggingOver ? "bg-slate-100" : "bg-white"
                }`}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(draggableProvided, draggableSnapshot) => (
                        <UiTableRow
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          data-state={row.getIsSelected() && "selected"}
                          className={
                            draggableSnapshot.isDragging
                              ? "opacity-50 bg-slate-50"
                              : ""
                          }
                        >
                          {row.getVisibleCells().map((cell, cellIndex) => (
                            <UiTableCell
                              key={cell.id}
                              {...(cellIndex === 0 && dragable
                                ? draggableProvided.dragHandleProps
                                : {})}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </UiTableCell>
                          ))}
                        </UiTableRow>
                      )}
                    </Draggable>
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
                {droppableProvided.placeholder}
              </UiTableBody>
            )}
          </Droppable>
        </DragDropContext>
      </UiTable>

      {!!total_pages && total_pages > 1 && (
        <div className="w-full flex justify-end mt-4">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem
                  className="cursor-pointer"
                  onClick={handlePreviousPage}
                >
                  <PaginationPrevious />
                </PaginationItem>
                {Array.from({ length: total_pages }, (_, index) => (
                  <PaginationItem
                    key={index}
                    className="cursor-pointer"
                    onClick={() => handlePageChange(index)}
                  >
                    <PaginationLink isActive={page === index}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem
                  className="cursor-pointer"
                  onClick={handleNextPage}
                >
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </>
  );
}

// Versão memoizada do componente
const Table = memo(TableComponent) as typeof TableComponent;

export default Table;
