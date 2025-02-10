import { Food } from "@/types/api/Food";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import Image from "next/image";
import FoodDefault from "@/assets/default-food.jpg";
import { currency } from "@/utils/text";
import GlutenFree from "@/components/icons/GlutenFree";
import LactoseFree from "@/components/icons/LactoseFree";
import Vegan from "@/components/icons/Vegan";
import Vegetarian from "@/components/icons/Vegetarian";
import Price from "@/components/Price";

type FoodModalProps = {
  food?: Food;
  onClose: () => void;
};

export default function FoodModal({ food, onClose }: FoodModalProps) {
  return (
    <Modal
      isOpen={!!food}
      onClose={onClose}
      size="2xl"
      className="max-h-[80vh] overflow-auto"
    >
      <ModalContent>
        {food && (
          <>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <div className="flex gap-4">
                <Image
                  src={food.image?.url || FoodDefault}
                  width={200}
                  height={200}
                  alt={food.name}
                  className="rounded-md"
                />
                <div className="w-full flex flex-col justify-between">
                  <div>
                    <p className="text-lg">{food.name}</p>
                    <p className="text-gray-400">{food.description}</p>
                    <div className="flex text-gray-400 mt-2">
                      {food.gluten_free && (
                        <Tooltip content="Sem glúten">
                          <GlutenFree width={24} height={24} />
                        </Tooltip>
                      )}
                      {food.lactose_free && (
                        <Tooltip content="Sem lactose">
                          <LactoseFree width={24} height={24} />
                        </Tooltip>
                      )}
                      {food.vegan && (
                        <Tooltip content="Vegano">
                          <Vegan width={24} height={24} />
                        </Tooltip>
                      )}
                      {food.vegetarian && (
                        <Tooltip content="Vegetariano">
                          <Vegetarian width={24} height={24} />
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <Price
                    discount={food.active_discount}
                    price={food.price}
                    className="text-medium"
                    discountIcon={false}
                  />
                </div>
              </div>
              {food.item_categories.length > 0 && (
                <>
                  <hr className="w-full" />
                  {food.item_categories.map(
                    (category) =>
                      category.food_items.length > 0 && (
                        <>
                          <div className="w-full">
                            <h3>{category.title}</h3>

                            <div className="ml-2 mt-2 flex flex-col gap-2">
                              {category.food_items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex gap-4 border rounded-md px-4 py-2 cursor-pointer h-28"
                                >
                                  <Image
                                    src={item.image?.url || FoodDefault}
                                    alt="Imagem do item"
                                    className="object-cover rounded-md"
                                    width={100}
                                    height={100}
                                    quality={100}
                                  />
                                  <div className="flex-1 w-full flex flex-col justify-between py-1">
                                    <div className="">
                                      <h4 className="">{item.title}</h4>
                                      <p className="text-sm text-gray-400">
                                        {item.description}
                                      </p>
                                    </div>
                                    <p className="text-sm text-end">
                                      {item.price_increase
                                        ? `+ ${currency(item.price_increase)}`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                  )}
                </>
              )}
            </ModalBody>

            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
