import Block, { TabsTrigger } from "@/components/Block";
import FoodDiscounts from "@/components/Dashboard/Food/DiscountsList";
import FoodForm from "@/components/Dashboard/Food/FoodForm";
import useFood from "@/hooks/queries/food/useFood";
import { useState } from "react";
import FoodDefault from "@/assets/default-food.jpg";
import { format } from "date-fns";
import FoodItem from "@/components/Dashboard/Food/FoodItem";
import { createFileRoute } from "@tanstack/react-router";

enum WIZARD_PAGES {
  ITEMS = "Itens",
  DATA = "Dados",
  DISCOUNTS = "Descontos",
}

export const Route = createFileRoute("/dashboard/food/$id")({
  component: FoodEditPage,
});

function FoodEditPage() {
  const { id } = Route.useParams();
  const { data: food, refetch } = useFood(id);
  const [page, setPage] = useState<WIZARD_PAGES>(WIZARD_PAGES.ITEMS);

  return (
    food && (
      <>
        <Block className="flex flex-row gap-6 mb-2">
          <div>
            <img
              src={food.image?.url || FoodDefault}
              alt={food.name}
              width={300}
              height={400}
              className="object-cover"
            />
          </div>
          <div className="flex-1 relative text-md">
            <h1 className="font-semibold text-lg">{food.name}</h1>
            <p className="line-clamp-3 text-muted-foreground">
              {food.description}
            </p>
            <p className="text-muted-foreground mt-4">
              <span className="font-bold">Categoria:</span> {food.category.name}
            </p>
            <p className="text-muted-foreground">
              <span className="font-bold">Preço:</span> R${food.price}
            </p>
            <div className="absolute bottom-0 right-0">
              <p className="text-xs text-muted-foreground">
                Atualizado em:{" "}
                {format(new Date(food.updated_at), "dd/MM/yyyy HH:mm")}
              </p>
            </div>
          </div>
        </Block>
        <Block
          className="mb-4"
          tabs={
            <>
              <TabsTrigger
                value={WIZARD_PAGES.ITEMS}
                className="ml-6"
              >
                {WIZARD_PAGES.ITEMS}
              </TabsTrigger>
              <TabsTrigger value={WIZARD_PAGES.DATA}>
                {WIZARD_PAGES.DATA}
              </TabsTrigger>
              <TabsTrigger value={WIZARD_PAGES.DISCOUNTS}>
                {WIZARD_PAGES.DISCOUNTS}
              </TabsTrigger>
            </>
          }
          tabsProps={{
            onSelectionChange: (key) => setPage(key as WIZARD_PAGES),
            selectedKey: page,
          }}
        >
          {page === WIZARD_PAGES.ITEMS && <FoodItem food={food} />}
          {page === WIZARD_PAGES.DATA && (
            <FoodForm food={food} onSuccess={() => refetch()} />
          )}
          {page === WIZARD_PAGES.DISCOUNTS && <FoodDiscounts />}
        </Block>
      </>
    )
  );
}
