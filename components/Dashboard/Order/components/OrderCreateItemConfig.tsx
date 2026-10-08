import Button from "@/components/Button";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import Textarea from "@/components/Textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FoodOrder } from "@/hooks/useCart";
import { Food } from "@/types/api/Food";
import { FoodItem } from "@/types/api/food/FoodItem";
import { FoodItemCategory } from "@/types/api/food/FoodItemCategory";
import { currency } from "@/utils/text";
import { Fragment, useEffect, useRef, useState } from "react";
import { BiMinus } from "react-icons/bi";
import { GoPlus } from "react-icons/go";
import { toast } from "react-toastify";

type OrderCreateItemConfigProps = {
  food: Food;
  onClose: () => void;
  onAdd: (item: FoodOrder) => void;
};

export default function OrderCreateItemConfig({
  food,
  onClose,
  onAdd,
}: OrderCreateItemConfigProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [currentItem, setCurrentItem] = useState<FoodOrder>(
    createFoodOrder(food)
  );

  const addSubItem = (item: FoodItem) => {
    const defaultItem = {
      id: crypto.randomUUID(),
      itemId: item.id,
      image: item.image?.url || "",
      title: item.title,
      description: item.description,
      price: item.price_increase ?? 0,
      quantity: 1,
    };

    setCurrentItem((state) => {
      const existingItemIndex = state.items.findIndex(
        (subItem) => subItem.itemId === item.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };

        return {
          ...state,
          items: updatedItems,
        };
      }

      return {
        ...state,
        items: [...state.items, defaultItem],
      };
    });
  };

  const removeSubItem = (itemId: string) => {
    setCurrentItem((state) => ({
      ...state,
      items: state.items
        .map((item) => {
          if (item.itemId === itemId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        })
        .filter((item) => item.quantity > 0),
    }));
  };

  const changeQuantity = (quantity: number) => {
    setCurrentItem((state) => ({
      ...state,
      quantity: Math.max(1, state.quantity + quantity),
    }));
  };

  const handleAdd = () => {
    const invalidCategories = food.item_categories
      .filter((category) => {
        const totalSelected = getTotalSelectedByCategory(category, currentItem);
        return totalSelected < (category.min_items || 0);
      })
      .map((category) => category.title);

    if (invalidCategories.length > 0) {
      toast.error(
        `A categoria(s) ${invalidCategories.join(
          ", "
        )} não atingiu o mínimo de itens selecionados.`
      );
      return;
    }

    onAdd({
      ...currentItem,
      observation: textAreaRef.current?.value,
    });
    onClose();
  };

  useEffect(() => {
    setCurrentItem(createFoodOrder(food));
  }, [food]);

  return (
    <Dialog
      open={Boolean(food)}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader data-test="item-config-modal">
          <div>
            <h2 className="text-xl">{food.name}</h2>
            <p className="text-sm text-muted-foreground">{food.description}</p>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="text-sm text-muted-foreground">Quantidade</p>
              <p className="font-semibold">
                {currentItem.quantity} unidade(s)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                type="button"
                onClick={() => changeQuantity(-1)}
                disabled={currentItem.quantity <= 1}
              >
                <BiMinus />
              </Button>
              <span className="min-w-6 text-center font-semibold">
                {currentItem.quantity}
              </span>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                type="button"
                onClick={() => changeQuantity(1)}
              >
                <GoPlus />
              </Button>
            </div>
          </div>

          {food.item_categories.length > 0 && (
            <>
              <Separator />
              {food.item_categories.map(
                (category) =>
                  category.food_items.length > 0 && (
                    <Fragment key={category.id}>
                      <div className="w-full">
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg">{category.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          </div>
                          <div className="text-md text-muted-foreground">
                            {getTotalSelectedByCategory(category, currentItem)}/
                            {category.max_items}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {category.food_items.map((item, index) => (
                            <Fragment key={item.id}>
                              <SimpleFoodItem
                                title={item.title}
                                description={item.description}
                                image={item.image?.url}
                                price={item.price_increase}
                                onClickAdd={() => {
                                  if (
                                    getTotalSelectedByCategory(
                                      category,
                                      currentItem
                                    ) < category.max_items
                                  ) {
                                    addSubItem(item);
                                  }
                                }}
                                onClickRemove={() => removeSubItem(item.id)}
                                total={
                                  currentItem.items.find(
                                    (selectedItem) =>
                                      selectedItem.itemId === item.id
                                  )?.quantity || 0
                                }
                              />
                              {index < category.food_items.length - 1 && (
                                <Separator />
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  )
              )}
            </>
          )}

          <Textarea
            label="Observações"
            placeholder="Ex: Sem cebola, ponto da carne, etc."
            ref={textAreaRef}
            data-test="input-item-observation"
          />
        </div>
        <DialogFooter>
          <div className="flex w-full flex-row items-center justify-between">
            <p>Total: {currency(calcTotal(currentItem))}</p>
            <Button
              text="Adicionar"
              onClick={handleAdd}
              type="button"
              data-test="button-confirm-item"
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const createFoodOrder = (food: Food): FoodOrder => ({
  id: crypto.randomUUID(),
  itemId: food.id,
  quantity: 1,
  image: food.image?.url || "",
  title: food.name,
  description: food.description,
  price: food.price,
  discount: food.active_discount,
  items: [],
});

const calcTotal = (food: FoodOrder) => {
  const itemsTotal = food.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (food.price + itemsTotal) * food.quantity;
};

const getTotalSelectedByCategory = (
  category: FoodItemCategory,
  currentItem: FoodOrder
) => {
  return category.food_items.reduce((acc, item) => {
    const selectedItem = currentItem.items.find(
      (currentSubItem) => currentSubItem.itemId === item.id
    );
    return acc + (selectedItem?.quantity || 0);
  }, 0);
};
