import Table from "@/components/Table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useBanners from "@/hooks/queries/banner/useBanners";
import { Banner, BannerRedirect, BannerType } from "@/types/api/Banner";
import { bannerRedirectMasks, bannerTypeMasks } from "@/utils/lists";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { HiChevronDoubleRight } from "react-icons/hi";
import TableAction from "./components/TableAction";

const bannerRedirectsColors: Record<BannerRedirect, string> = {
  FOOD: "bg-green-500",
  CATEGORY: "bg-yellow-500",
  URL: "bg-muted-foreground",
};

const bannerTypeColors: Record<BannerType, string> = {
  DESKTOP: "bg-green-500",
  MOBILE: "bg-yellow-500",
};

export default function BannerTable() {
  const { data: banners, isFetching } = useBanners();
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<Banner, unknown>[]>(
    () => [
      {
        id: "status",
        maxSize: 35,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex justify-center items-center rounded-full w-2 h-2 ${
                      row.original.active
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {row.original.active ? "Ativo" : "Inativo"}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        },
      },
      {
        header: "Título",
        accessorKey: "title",
      },
      {
        header: "Redirecionar para",
        cell: ({ row }) => (
          <Badge
            className={`${bannerRedirectsColors[row.original.redirect]} text-white`}
          >
            {bannerRedirectMasks[row.original.redirect]}
          </Badge>
        ),
      },
      {
        header: "Tipo",
        cell: ({ row }) => (
          <Badge
            className={`${bannerTypeColors[row.original.type]} text-white`}
          >
            {bannerTypeMasks[row.original.type]}
          </Badge>
        ),
      },
      {
        header: "Criado em",
        accessorFn: (row) =>
          format(new Date(row.created_at), "dd/MM/yyyy HH:mm"),
      },
      {
        header: "Atualizado em",
        accessorFn: (row) =>
          format(new Date(row.updated_at), "dd/MM/yyyy HH:mm"),
      },
      {
        id: "action",
        maxSize: 40,
        cell: ({ row }) => <TableAction formId={row.original.id} />,
      },
    ],
    [banners?.content]
  );

  const totalPages = banners?.page?.total_pages ?? 1;
  const currentPage = page;

  return (
    <>
      <Table
        aria-label="Discounts"
        data={banners?.content || []}
        columns={columns}
        bodyProps={{
          emptyContent: "Nenhum banner cadastrado",
          isLoading: isFetching,
        }}
      />
      {banners && totalPages > 1 && (
        <div className="w-full flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
