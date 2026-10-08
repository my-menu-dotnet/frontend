import FoodCard from "@/components/FoodCard";
import Input from "@/components/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category } from "@/types/api/Category";
import { Food } from "@/types/api/Food";
import { SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

type OrderCreateItemPickerProps = {
  categories: Category[];
  onClose: () => void;
  onSelect: (foodId: string) => void;
};

export default function OrderCreateItemPicker({
  categories,
  onClose,
  onSelect,
}: OrderCreateItemPickerProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const visibleCategories = useMemo(() => {
    const base =
      activeCategoryId === "ALL"
        ? categories
        : categories.filter((category) => category.id === activeCategoryId);

    const term = search.trim().toLowerCase();
    if (!term) return base;

    return base
      .map((category) => ({
        ...category,
        foods: category.foods.filter(
          (food) =>
            food.name.toLowerCase().includes(term) ||
            (food.description ?? "").toLowerCase().includes(term),
        ),
      }))
      .filter((category) => category.foods.length > 0);
  }, [activeCategoryId, categories, search]);

  const handleSelect = (food: Food) => {
    onSelect(food.id);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader data-test="food-picker-modal">
          <DialogTitle>Adicionar item</DialogTitle>
        </DialogHeader>
        <div className="py-2 flex flex-col gap-4">
          <Input
            placeholder="Buscar produto pelo nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<SearchIcon className="size-4 text-muted-foreground" />}
            data-test="food-picker-search"
          />
          {categories.length > 0 && (
            <Tabs
              value={activeCategoryId}
              onValueChange={setActiveCategoryId}
              className="w-full"
            >
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="ALL">
                  <span>Todos</span>
                </TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          <div className="w-full">
            {visibleCategories.length > 0 ? (
              visibleCategories.map((category) => (
                <section
                  key={category.id}
                  id={category.id}
                  className="mt-4 flex flex-col gap-4"
                >
                  <h2 className="font-heading">{category.name}</h2>
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
              ))
            ) : (
              <div className="flex h-32 items-center justify-center text-center text-muted-foreground">
                Nenhum produto encontrado.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
