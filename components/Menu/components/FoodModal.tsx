import { Food } from "@/types/api/Food";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FoodDefault from "@/assets/default-food.jpg";
import { currency } from "@/utils/text";
import GlutenFree from "@/components/icons/GlutenFree";
import LactoseFree from "@/components/icons/LactoseFree";
import Vegan from "@/components/icons/Vegan";
import Vegetarian from "@/components/icons/Vegetarian";
import Price from "@/components/Price";
import { GoPlus } from "react-icons/go";
import { BiMinus } from "react-icons/bi";
import Button from "@/components/Button";
import { Fragment, useEffect, useRef, useState } from "react";
import { FoodOrder, useCart } from "@/hooks/useCart";
import { FoodItem } from "@/types/api/food/FoodItem";
import SimpleFoodItem from "@/components/SimpleFoodItem";
import Textarea from "@/components/Textarea";
import { FoodItemCategory } from "@/types/api/food/FoodItemCategory";
import { toast } from "react-toastify";
import { BusinessHours } from "@/types/api/BusinessHours";
import { useBusinessStatus } from "@/hooks/useBusinessStatus";

type FoodModalProps = {
  food?: Food;
  onClose: () => void;
  businessHours?: BusinessHours[];
};

export default function FoodModal({ food, onClose, businessHours = [] }: FoodModalProps) {
  const { addItem } = useCart();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { isOpen, status } = useBusinessStatus(businessHours);
  const [currentItem, setCurrentItem] = useState<FoodOrder>({
    id: crypto.randomUUID(),
    itemId: food?.id || "",
    quantity: 1,
    image: food?.image?.url || "",
    title: food?.name || "",
    description: food?.description || "",
    price: food?.price || 0,
    discount: food?.active_discount,
    items: [],
  });

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
        (i) => i.itemId === item.id
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
      } else {
        return {
          ...state,
          items: [...state.items, defaultItem],
        };
      }
    });
  };
  const removeSubItem = (itemId: string) => {
    const newItems = currentItem?.items.map((item) => {
      if (item.itemId === itemId) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCurrentItem((state) => ({
      ...state,
      items: newItems?.filter((item) => item.quantity > 0) || [],
    }));
  };

  const handleAddToCart = () => {
    if (!isOpen) {
      toast.error(`Não é possível fazer pedidos agora. ${status}.`);
      return;
    }

    const invalidCategories = food?.item_categories
      .filter((category) => {
        const totalSelected = getTotalSelectedByCategory(category, currentItem);
        return totalSelected < (category.min_items || 0);
      })
      .map((category) => category.title);

    if (invalidCategories && invalidCategories.length > 0) {
      toast.error(
        `A categoria(s) ${invalidCategories.join(
          ", "
        )} não atingiu o mínimo de itens selecionados.`
      );
      return;
    }

    currentItem.observation = textAreaRef.current?.value;
    addItem(currentItem);
    onClose();
  };

  useEffect(() => {
    if (food) {
      setCurrentItem({
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
    }
  }, [food]);

  return (
    <Dialog
      open={!!food}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        {food && (
          <>
            <DialogHeader>
              <DialogTitle>{food.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-4">
                <div className="w-full flex justify-center">
                  <img
                    src={food.image?.url || FoodDefault}
                    width={300}
                    height={300}
                    alt={food.name}
                    className="rounded-md w-full max-w-[250px] object-cover"
                  />
                </div>
                <div className="w-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl">{food.name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {food.description}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex text-muted-foreground gap-2">
                        {food.gluten_free && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <GlutenFree width={24} height={24} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Sem glúten</TooltipContent>
                          </Tooltip>
                        )}
                        {food.lactose_free && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <LactoseFree width={24} height={24} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Sem lactose</TooltipContent>
                          </Tooltip>
                        )}
                        {food.vegan && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Vegan width={24} height={24} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Vegano</TooltipContent>
                          </Tooltip>
                        )}
                        {food.vegetarian && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Vegetarian width={24} height={24} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Vegetariano</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex justify-end font-bold">
                        <Price
                          discount={food.active_discount}
                          price={food.price}
                          className="text-medium"
                          discountIcon={false}
                        />
                      </div>
                    </div>
                  </div>
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
                            <div className="mb-2 flex justify-between items-center">
                              <div>
                                <h3 className="text-lg">{category.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {category.description}
                                </p>
                              </div>
                              <div className="text-md text-muted-foreground">
                                {getTotalSelectedByCategory(
                                  category,
                                  currentItem
                                )}
                                /{category.max_items}
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
                                        (i) => i.itemId === item.id
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
              />
            </div>
            <DialogFooter>
              <div className="flex flex-row justify-between items-center w-full">
                <div>
                  {!isOpen && (
                    <p className="text-red-600 text-sm">{status}</p>
                  )}
                  <p>Total: {currency(calcTotal(currentItem))}</p>
                </div>
                <Button
                  onClick={() => handleAddToCart()}
                  text={isOpen ? "Adicionar ao carrinho" : "Estabelecimento fechado"}
                  isDisabled={!isOpen}
                  color={isOpen ? "primary" : "default"}
                />
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const calcTotal = (food: FoodOrder) => {
  const itemsTotal = food.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return food.price + itemsTotal;
};

const getTotalSelectedByCategory = (
  category: FoodItemCategory,
  currentItem: FoodOrder
) => {
  return category.food_items.reduce((acc, item) => {
    const citem = currentItem.items.find((i) => i.itemId === item.id);
    return acc + (citem?.quantity || 0);
  }, 0);
};
