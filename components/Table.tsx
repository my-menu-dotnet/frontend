import {
  Table as ShadcnTable,
  TableBody as ShadcnTableBody,
  TableCell as ShadcnTableCell,
  TableHead as ShadcnTableHead,
  TableHeader as ShadcnTableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  InitialTableState,
  useReactTable,
} from "@tanstack/react-table";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement> & {
  /** Empty-state content rendered when `data` is empty. */
  emptyContent?: React.ReactNode;
  /** Loading flag — renders a spinner placeholder. */
  isLoading?: boolean;
  /** Custom empty-state description (overrides `emptyContent`). */
  emptyDescription?: string;
};

type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  columns: ColumnDef<T>[];
  data: T[];
  initialState?: InitialTableState;
  bodyProps?: TableBodyProps;
  classNames?: {
    wrapper?: string;
    th?: string;
    table?: string;
    base?: string;
  };
};

export default function Table<T>({
  columns,
  data,
  initialState,
  bodyProps,
  classNames,
  className,
  ...props
}: TableProps<T>) {
  const { getHeaderGroups, getRowModel } = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: initialState,
  });

  const { emptyContent, isLoading, emptyDescription, ...bodyRest } =
    bodyProps ?? {};

  const hasData = getRowModel().rows.length > 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card",
        classNames?.wrapper,
        classNames?.base,
      )}
    >
      {hasData ? (
        <ShadcnTable className={cn(classNames?.table, className)} {...props}>
          <ShadcnTableHeader>
            {getHeaderGroups().map((group) => (
              <ShadcnTableRow key={group.id}>
                {group.headers.map((header) => (
                  <ShadcnTableHead
                    key={header.id}
                    className={cn("uppercase", classNames?.th)}
                    style={{ maxWidth: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </ShadcnTableHead>
                ))}
              </ShadcnTableRow>
            ))}
          </ShadcnTableHeader>
          <ShadcnTableBody {...bodyRest}>
            {getRowModel().rows.map((row) => (
              <ShadcnTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <ShadcnTableCell
                    key={cell.id}
                    style={{ maxWidth: `${cell.column.getSize()}px` }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </ShadcnTableCell>
                ))}
              </ShadcnTableRow>
            ))}
          </ShadcnTableBody>
        </ShadcnTable>
      ) : (
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>
                  {emptyContent ?? "Nenhum item encontrado"}
                </EmptyTitle>
                {emptyDescription && (
                  <EmptyDescription>{emptyDescription}</EmptyDescription>
                )}
              </EmptyHeader>
            </Empty>
          )}
        </div>
      )}
    </div>
  );
}
