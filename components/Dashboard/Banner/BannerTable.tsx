import Table from "@/components/Table";
import useBanners from "@/hooks/queries/banner/useBanners";
import { Banner, BannerRedirect, BannerType } from "@/types/api/Banner";
import { bannerRedirectMasks, bannerTypeMasks } from "@/utils/lists";
import { Chip, Pagination, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { HiChevronDoubleRight } from "react-icons/hi";
import TableAction from "./components/TableAction";

const bannerRedirectsColors = {
  FOOD: "success",
  CATEGORY: "warning",
  URL: "default",
} as {
  [key in BannerRedirect]: "success" | "warning" | "default";
};

const bannerTypeColors = {
  DESKTOP: "success",
  MOBILE: "warning",
} as {
  [key in BannerType]: "success" | "warning";
};

export default function BannerTable() {
  const { data: banners, isFetching } = useBanners();

  const columns = useMemo<ColumnDef<Banner, unknown>[]>(
    () => [
      {
        id: "status",
        maxSize: 35,
        cell: ({ row }) => {
          return (
            <div className="flex items-center justify-center">
              <Tooltip
                color={row.original.active ? "success" : "warning"}
                content={row.original.active ? "Ativo" : "Inativo"}
              >
                <div
                  className={`flex justify-center items-center rounded-full w-2 h-2 bg-${
                    row.original.active ? "success" : "warning"
                  }`}
                />
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
          <Chip
            color={bannerRedirectsColors[row.original.redirect]}
            variant="flat"
            size="sm"
          >
            {bannerRedirectMasks[row.original.redirect]}
          </Chip>
        ),
      },
      {
        header: "Tipo",
        cell: ({ row }) => (
          <Chip
            color={bannerTypeColors[row.original.type]}
            variant="flat"
            size="sm"
          >
            {bannerTypeMasks[row.original.type]}
          </Chip>
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
      <div className="w-full flex justify-end">
        {banners && banners.total_pages > 1 && (
          <Pagination initialPage={1} total={banners?.total_pages} />
        )}
      </div>
    </>
  );
}
