import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { GoPlus } from "react-icons/go";
import CategoryItem from "@/components/Dashboard/Menu/Categories/CategoryItem";
import CategoryModal from "@/components/Dashboard/Menu/Categories/CategoryModal";
import useCategory from "@/hooks/queries/useCategory";
import { Category } from "@/types/api/Category";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import CategoryDelete from "@/components/Dashboard/Menu/Categories/CategoryDelete";
import { Skeleton } from "@/components/ui/skeleton";
import Block from "@/components/Block";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/menu/categories")({
  component: MenuCategoriesPage,
});

/**
 * State carried by the open edit modal:
 * - `null`            → modal closed
 * - `{ mode: "new" }` → creating a new category
 * - `{ mode, category }` → editing an existing one
 */
type EditTarget =
  | null
  | { mode: "new" }
  | { mode: "edit"; category: Category };

function MenuCategoriesPage() {
  const { data: categories, isLoading } = useCategory();
  const [itemsCategories, setItemsCategories] = useState<Category[]>();
  const [openEdit, setOpenEdit] = useState<EditTarget>(null);
  const [openDelete, setOpenDelete] = useState<Category | null>(null);

  const { mutate } = useMutation({
    mutationKey: ["update-order-category"],
    mutationFn: async (listId: string[]) => {
      return await api.put("/category/order", { ids: listId });
    },
  });

  const handleUpdateOrder = async (categories: Category[]) => {
    const idList = categories.map((category) => category.id);
    mutate(idList);
  };

  const handleDragEnd = (result: DropResult<string>) => {
    if (!result.destination || !itemsCategories) {
      return;
    }

    const items = Array.from(itemsCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setItemsCategories(items);
    handleUpdateOrder(items);
  };

  useEffect(() => {
    if (categories) {
      setItemsCategories(categories);
    }
  }, [categories]);

  return (
    <Block>
      <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Organize os itens do seu cardápio em categorias.
          </p>
        </div>
        <Button
          data-test="add-category"
          onPress={() => setOpenEdit({ mode: "new" })}
        >
          <GoPlus size={20} />
          Adicionar
        </Button>
      </div>

      {itemsCategories && !isLoading ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div
                data-test="container-categories"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {itemsCategories && itemsCategories?.length > 0 ? (
                  itemsCategories?.map((category, index) => (
                    <Draggable
                      key={category.id}
                      draggableId={category.id}
                      index={index}
                    >
                      {(provided) => (
                        <CategoryItem
                          key={category.id}
                          category={category}
                          onClickEdit={() => {
                            setOpenEdit({ mode: "edit", category });
                          }}
                          onClickDelete={() => {
                            setOpenDelete(category);
                          }}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Nenhuma categoria encontrada
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Skeleton className="w-full h-20" />
      )}

      <CategoryModal
        target={openEdit}
        onClose={() => setOpenEdit(null)}
      />
      <CategoryDelete
        category={openDelete}
        open={Boolean(openDelete)}
        onClose={() => {
          setOpenDelete(null);
        }}
      />
    </Block>
  );
}
