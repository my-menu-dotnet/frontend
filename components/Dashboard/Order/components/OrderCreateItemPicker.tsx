import FoodCard from "@/components/FoodCard";
import { Category } from "@/types/api/Category";
import { Food } from "@/types/api/Food";
import { Modal, ModalBody, ModalContent, ModalHeader, Tab, Tabs } from "@nextui-org/react";
import { Montserrat } from "next/font/google";
import { useMemo, useState } from "react";

type OrderCreateItemPickerProps = {
  categories: Category[];
  onClose: () => void;
  onSelect: (foodId: string) => void;
};

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

export default function OrderCreateItemPicker({
  categories,
  onClose,
  onSelect,
}: OrderCreateItemPickerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");

  const visibleCategories = useMemo(() => {
    if (activeCategoryId === "ALL") {
      return categories;
    }

    return categories.filter((category) => category.id === activeCategoryId);
  }, [activeCategoryId, categories]);

  const handleSelect = (food: Food) => {
    onSelect(food.id);
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} size="4xl" className="max-h-[80vh]">
      <ModalContent>
        <ModalHeader data-test="food-picker-modal">Adicionar item</ModalHeader>
        <ModalBody className="overflow-auto">
          {categories.length > 0 && (
            <Tabs
              aria-label="Categorias de produtos"
              className="mt-2 w-full"
              classNames={{
                tabList:
                  "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "text-black " + montserrat.className,
              }}
              color="primary"
              variant="underlined"
              selectedKey={activeCategoryId}
              onSelectionChange={(key) => setActiveCategoryId(String(key))}
            >
              <Tab
                key="ALL"
                title={
                  <div className="flex items-center gap-2">
                    <span>Todos</span>
                  </div>
                }
              />
              {categories.map((category) => (
                <Tab
                  key={category.id}
                  title={
                    <div className="flex items-center gap-2">
                      <span>{category.name}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          )}

          <div className="w-full">
            {visibleCategories.map(
              (category) =>
                category.foods.length > 0 && (
                  <section
                    key={category.id}
                    id={category.id}
                    className="mt-4 flex flex-col gap-4"
                  >
                    <h2 className={montserrat.className}>{category.name}</h2>
                    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {category.foods.map((food) => (
                        <FoodCard
                          key={food.id}
                          food={food}
                          className="cursor-pointer"
                          onClick={() => handleSelect(food)}
                        />
                      ))}
                    </ul>
                  </section>
                )
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
