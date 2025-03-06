"use client";

import Block from "@/components/Block";
import OrderOverview from "@/components/OrderOverview";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import Table from "@/components/Table";
import useOrdersUser from "@/hooks/queries/order/useOrdersUser";
import useOrderUserTotal from "@/hooks/queries/order/useOrderUserTotal";
import useUser from "@/hooks/queries/useUser";
import { Order } from "@/types/api/order/Order";
import { orderStatusColor, orderStatusMask } from "@/utils/order";
import { currency } from "@/utils/text";
import { Divider, Pagination, Tooltip } from "@nextui-org/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";

export default function Page() {
  const { data: orders, filters, setFilters } = useOrdersUser();
  const { data: orderTotal } = useOrderUserTotal();
  const { data: user } = useUser();
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const params = useParams();
  const menuId = params.id;

  const handlePageChange = (page: number) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, page: page - 1 };
      console.log("Updating filters to:", newFilters);
      return newFilters;
    });
  };

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
    [orders?.content]
  );

  useEffect(() => {
    if (!orders?.content || !(orders?.page?.number === 0)) {
      return;
    }
    setLastOrder(orders?.content[0]);
  }, [orders]);

  return (
    <>
      <div className="px-4 py-6 flex items-center">
        <Link href={`/menu/${menuId}`}>
          <FaChevronLeft />
        </Link>
      </div>
      <section className="min-h-screen max-w-4xl mx-auto">
        <Block className="mb-4">
          <h1 className="text-lg font-semibold">Meu perfil</h1>
          <p className="text-gray-500">
            Veja todas as informações do seu perfil
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div>
              <h1 className="text-lg font-semibold">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </Block>
        {lastOrder && (
          <Block className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-lg font-semibold">Último pedido</h1>
                <p className="text-gray-500">
                  Veja todos os detalhes do seu último pedido
                </p>
              </div>
              <div>
                <Tooltip
                  content={orderStatusMask(lastOrder.status)}
                  className={`${orderStatusColor(lastOrder.status)} text-white`}
                >
                  <div
                    className={`${orderStatusColor(
                      lastOrder.status
                    )} w-4 h-4 rounded-full`}
                  ></div>
                </Tooltip>
              </div>
            </div>
            <Divider className="my-4" />
            {lastOrder.order_items.map((item) => (
              <div key={item.id}>
                <div>
                  <SimpleFoodItem
                    title={item.title}
                    price={item.unit_price}
                    description={item.observation || ""}
                    discount={item.discount}
                    image={item.image.url}
                    total={item.quantity}
                    hasIncrease={false}
                    hasChangeQuantity={false}
                  />
                </div>
                {item.order_items &&
                  item.order_items.map((subItem) => (
                    <div key={subItem.id} className="ml-4">
                      <SimpleFoodItem
                        title={subItem.title}
                        price={subItem.unit_price}
                        description=""
                        discount={subItem.discount}
                        image={subItem.image.url}
                        total={subItem.quantity}
                        hasIncrease={false}
                        hasChangeQuantity={false}
                      />
                    </div>
                  ))}
              </div>
            ))}
            <p className="text-center text-gray-400">
              Para cancelar ou alterar o pedido, entre em contato com o
              estabelecimento
            </p>
          </Block>
        )}
        {orders && orders.content.length ? (
          <Block>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-lg font-semibold">Meus pedidos</h1>
                <p className="text-gray-500">
                  Veja todos os pedidos realizados por você
                </p>
              </div>
              <div className="flex-1 flex flex-col justify-end min-w-[200px] md:mt-0 mt-4">
                <div className="flex items-center justify-end gap-1 text-primary">
                  <h1 className="text-lg font-semibold">Total economizado</h1>
                  <Tooltip content="My Menu tem, em média, 30% de desconto em seus pedidos por não cobrarmos nenhuma taxas de nossos parceiros.">
                    <IoMdInformationCircleOutline />
                  </Tooltip>
                </div>
                <p className="text-gray-500 text-end">
                  {orderTotal
                    ? currency(calcSave(orderTotal.total))
                    : "R$ 0,00"}
                </p>
              </div>
            </div>
            <Table
              aria-label="Pedidos"
              data={orders?.content || []}
              columns={columns}
              className="min-h-[800px] mt-4"
              bodyProps={{
                emptyContent: "Nenhum desconto cadastrado",
              }}
            />
            <div className="w-full flex justify-end mt-4">
              {orders && orders?.page.total_pages > 1 && (
                <Pagination
                  total={orders.page.total_pages}
                  page={(filters.page || 0) + 1}
                  onChange={handlePageChange}
                />
              )}
            </div>
          </Block>
        ) : (
          <Block>
            <h1 className="text-lg font-semibold">Meus pedidos</h1>
            <p className="text-gray-500">
              Veja todos os pedidos realizados por você
            </p>
            <div className="w-full flex justify-center items-center mt-4 min-h-36">
              <p className="text-gray-400">
                Parece que você ainda não fez nenhum pedido
              </p>
            </div>
          </Block>
        )}
      </section>
    </>
  );
}

// My Menu has on average 30% of discount
const calcSave = (total: number) => {
  return total * 0.3;
};
