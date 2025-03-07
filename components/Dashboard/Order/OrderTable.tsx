import Table from "@/components/Table";
import useOrders from "@/hooks/queries/order/useOrders";
import { Order } from "@/types/api/order/Order";
import { orderStatusColor, orderStatusMask } from "@/utils/order";
import { currency } from "@/utils/text";
import { Tooltip, User } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import OrderModal from "./components/OrderModal";
import Button from "@/components/Button";
import { TiChevronRight } from "react-icons/ti";
import { useNotificationOrder } from "@/hooks/useNotificationOrder";

export default function OrderTable() {
  const { data: orders, refetch: refetchOrders, isLoading } = useOrders();
  const [selected, setSelected] = useState<Order | undefined>();
  const { newOrder } = useNotificationOrder();

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
        accessorFn: (row) => `#${String(row.order_number).padStart(3, "0")}`,
      },
      {
        header: "Cliente",
        cell: ({ row }) => (
          <User
            name={row.original.user_name}
            description={row.original.user?.email}
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
      {
        id: "actions",
        maxSize: 35,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Button
              onPress={() => {
                setSelected(row.original);
              }}
              isIconOnly
              variant="light"
              color="warning"
              size="sm"
            >
              <TiChevronRight size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [orders]
  );

  useEffect(() => {
    if (newOrder) {
      refetchOrders();
    }
  }, [newOrder])

  return (
    <>
      <Table
        aria-label="Orders"
        data={orders?.content || []}
        columns={columns}
        bodyProps={{
          emptyContent: "Nenhum banner cadastrado",
          isLoading: isLoading,
        }}
      />
      <OrderModal
        order={selected}
        onClose={() => {
          setSelected(undefined);
          refetchOrders();
        }}
      />
    </>
  );
}
