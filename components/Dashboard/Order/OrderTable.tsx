import Table from "@/components/Table";
import useOrders from "@/hooks/queries/order/useOrders";
import { Order } from "@/types/api/order/Order";
import { orderStatusColor, orderStatusMask } from "@/utils/order";
import { currency } from "@/utils/text";
import { Tooltip, User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useMemo } from "react";

export default function OrderTable() {
  const { data: orders, isLoading } = useOrders();

  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        id: "status",
        maxSize: 35,
        cell: ({ row }) => {
          return (
            <div>
              <Tooltip
                content={orderStatusMask(row.original.status)}
                className={`${orderStatusColor(
                  row.original.status
                )} text-white`}
              >
                <div
                  className={`${orderStatusColor(
                    row.original.status
                  )} w-2 h-2 rounded-full`}
                ></div>
              </Tooltip>
            </div>
          );
        },
      },
      {
        header: "Pedido",
        accessorKey: "order_number",
      },
      {
        header: "Cliente",
        cell: ({ row }) => (
          <User
            name={row.original.user.name}
            description={row.original.user.email}
          />
        ),
      },
      {
        header: "Valor",
        cell: ({ row }) => <span>{currency(row.original.total_price)}</span>,
      },
      {
        header: "Data",
        cell: ({ row }) => (
          <span>{format(row.original.created_at, "dd/MM/yyyy HH:mm")}</span>
        ),
      },
    ],
    [orders]
  );

  return (
    <Table
      aria-label="Orders"
      data={orders?.content || []}
      columns={columns}
      bodyProps={{
        emptyContent: "Nenhum banner cadastrado",
        isLoading: isLoading,
      }}
    />
  );
}
