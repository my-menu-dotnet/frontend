"use client";

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
import { Skeleton } from "@nextui-org/react";

export default function Page() {
  const { data: categories, isLoading } = useCategory();
  const [itemsCategories, setItemsCategories] = useState<Category[]>();
  const [openEdit, setOpenEdit] = useState<Category | null>(null);
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
    <div>
      <div className="w-full flex justify-end mb-4">
        <Button
          onPress={() => {
            setOpenEdit({} as Category);
          }}
        >
          <GoPlus size={24} />
          Adicionar
        </Button>
      </div>

      {itemsCategories && itemsCategories.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {itemsCategories?.map((category, index) => (
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
                          setOpenEdit(category);
                        }}
                        onClickDelete={() => {
                          setOpenDelete(category);
                        }}
                        provided={provided}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : isLoading ? (
        <Skeleton className="h-12 w-full shadow rounded-md" />
      ) : (
        <div className="text-center text-gray-400">
          Nenhuma categoria encontrada
        </div>
      )}

      <CategoryModal
        newCategory={openEdit as Category}
        open={Boolean(openEdit)}
        setOpen={() => {
          setOpenEdit(null);
        }}
      />
      <CategoryDelete
        category={openDelete as Category}
        open={Boolean(openDelete)}
        onClose={() => {
          setOpenDelete(null);
        }}
      />
    </div>
  );
}
