import useCategories from "@/hooks/queries/category/useCategories";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/Table";
import Card from "@/components/Card";
import { Category } from "@/@types/api/Category";
import { format } from "date-fns";
import Dropdown from "@/components/Dropdown";
import { Button } from "@/components/_ui/button";
import { MoreHorizontal } from "lucide-react";
import { LuPenLine } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { useState } from "react";
import CreateEditModal from "./components/CreateEditeModal";
import Switch from "@/components/form/Switch";
import useMutateCategoryActive from "@/hooks/mutation/category/useMutateCategoryActive";
import DeleteModal from "./components/DeleteModal";
import useMutateCategoryOrder from "@/hooks/mutation/category/useMutateCategoryOrder";

export default function Categories() {
  const { data, setFilters } = useCategories({
    sort: "order",
  });
  const { mutate: mutateCateogryActive } = useMutateCategoryActive();
  const { mutate: mutateCategoryOrder } = useMutateCategoryOrder();
  const [openEdit, setOpenEdit] = useState<string | boolean>(false);
  const [openDelete, setOpenDelete] = useState<string>();

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "active",
      header: "Ativo",
      cell: ({ row }) => {
        const isActive = row.getValue("active") as boolean;
        return (
          <Switch
            noForm
            checked={isActive}
            onCheckedChange={() =>
              handleUpdateCategoryActive(row.original.id, !isActive)
            }
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "created_at",
      header: "Criado em",
      cell: (info) =>
        format(new Date(info.getValue() as string), "dd/MM/yyyy HH:mm:ss"),
    },
    {
      accessorKey: "updated_at",
      header: "Atualizado em",
      cell: (info) =>
        format(new Date(info.getValue() as string), "dd/MM/yyyy HH:mm:ss"),
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Dropdown
          content={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          }
        >
          <Dropdown.Item onClick={() => setOpenEdit(row.original.id)}>
            <LuPenLine />
            Editar
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setOpenDelete(row.original.id)}>
            <LuTrash2 />
            Excluir
          </Dropdown.Item>
        </Dropdown>
      ),
    },
  ];

  const handleUpdateCategoryActive = (id: string, active: boolean) => {
    mutateCateogryActive({ id, active });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleDragEnd = (sourceIndex: number, destinationIndex: number) => {
    const newData = [...(data?.content || [])];
    const [movedItem] = newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, movedItem);

    const newOrder = newData.map((item) => item.id);
    mutateCategoryOrder({ ids: newOrder });
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg">Categorias</h1>
          <Button onClick={() => setOpenEdit(true)}>Adicionar</Button>
        </div>
        <Table
          page={data?.page.number}
          total_pages={data?.page.total_pages}
          onPageChange={handlePageChange}
          data={data?.content || []}
          columns={columns}
          dragable
          onDragEnd={handleDragEnd}
        />
      </Card>

      <CreateEditModal
        open={openEdit}
        onOpenChange={() => {
          setOpenEdit(false);
        }}
      />

      <DeleteModal
        open={openDelete}
        onOpenChange={() => {
          setOpenDelete(undefined);
        }}
      />
    </>
  );
}
