import Button from "@/components/Button";
import ClientCombobox from "@/components/Dashboard/Client/ClientCombobox";
import ClientFormModal from "@/components/Dashboard/Client/ClientFormModal";
import Input from "@/components/Input";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
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
import QUERY_KEY from "@/constants/queryKey";
import { useMutationOrderAnonymous } from "@/hooks/mutate/useMutationOrderAnonymous";
import useCategory from "@/hooks/queries/useCategory";
import useFood from "@/hooks/queries/food/useFood";
import { FoodOrder } from "@/hooks/useCart";
import { AddressRequest } from "@/types/api/Address";
import { Client } from "@/types/api/Client";
import { Food } from "@/types/api/Food";
import { OrderItemForm } from "@/types/api/order/OrderItemForm";
import { states } from "@/utils/lists";
import { currency } from "@/utils/text";
import Yup from "@/validators/Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import OrderCreateItemConfig from "./OrderCreateItemConfig";
import OrderCreateItemPicker from "./OrderCreateItemPicker";

type OrderCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type OrderCreateForm = {
  userName: string;
  companyObservation?: string;
  address: AddressRequest;
};

type SelectedClientState = {
  client: Client | null;
  addressSnapshotTaken: boolean;
};

type FoodLoaderProps = {
  foodId: string;
  onLoad: (food: Food) => void;
  onClose: () => void;
};

const schema: Yup.ObjectSchema<OrderCreateForm> = Yup.object().shape({
  userName: Yup.string().required(),
  companyObservation: Yup.string().optional(),
  address: Yup.object().shape({
    zip_code: Yup.string()
      .transform((v) => (v ? String(v).replace(/\D/g, "") : v))
      .required("CEP é obrigatório")
      .test("cep-digits", "CEP inválido", (v) => !v || v.length === 8),
    state: Yup.string().required("Estado é obrigatório"),
    city: Yup.string().required("Cidade é obrigatória"),
    neighborhood: Yup.string().required("Bairro é obrigatório"),
    street: Yup.string().required("Rua é obrigatória"),
    number: Yup.string().required("Número é obrigatório"),
    complement: Yup.string().optional(),
  }),
});

const defaultValues: OrderCreateForm = {
  userName: "",
  companyObservation: "",
  address: {
    zip_code: "",
    state: "",
    city: "",
    neighborhood: "",
    street: "",
    number: "",
    complement: "",
  },
};

export default function OrderCreateModal({
  isOpen,
  onClose,
}: OrderCreateModalProps) {
  const queryClient = useQueryClient();
  const { data: categories } = useCategory();
  const { mutateAsync, isPending } = useMutationOrderAnonymous();
  const [items, setItems] = useState<FoodOrder[]>([]);
  const [pickingFood, setPickingFood] = useState(false);
  const [configuringFood, setConfiguringFood] = useState<Food | undefined>();
  const [selectedFoodId, setSelectedFoodId] = useState<string | undefined>();
  const [selectedClient, setSelectedClient] = useState<SelectedClientState>({
    client: null,
    addressSnapshotTaken: false,
  });
  const [createClientOpen, setCreateClientOpen] = useState(false);
  const [newClientPrefillName, setNewClientPrefillName] = useState("");

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<OrderCreateForm>({
      resolver: yupResolver(schema),
      defaultValues,
    });

  const userName = watch("userName");

  const handleClose = () => {
    reset(defaultValues);
    setItems([]);
    setPickingFood(false);
    setConfiguringFood(undefined);
    setSelectedFoodId(undefined);
    setSelectedClient({ client: null, addressSnapshotTaken: false });
    setCreateClientOpen(false);
    setNewClientPrefillName("");
    onClose();
  };

  const handleSelectFood = (foodId: string) => {
    queryClient.removeQueries({ queryKey: [QUERY_KEY.FOOD] });
    setConfiguringFood(undefined);
    setSelectedFoodId(foodId);
  };

  const handleLoadedFood = useCallback((food: Food) => {
    setConfiguringFood(food);
    setSelectedFoodId(undefined);
  }, []);

  const addItem = (item: FoodOrder) => {
    setItems((state) => [...state, item]);
  };

  const addItemUnity = (itemId: string) => {
    setItems((state) =>
      state.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        return item;
      }),
    );
  };

  const removeItemUnity = (itemId: string) => {
    setItems((state) =>
      state
        .map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((state) => state.filter((item) => item.id !== itemId));
  };

  const handleCreateOrder = async (data: OrderCreateForm) => {
    if (items.length === 0) {
      toast.error("Adicione ao menos um item ao pedido.");
      return;
    }

    const promise = mutateAsync({
      user_name: data.userName,
      company_observation: data.companyObservation || "",
      order_items: createOrderItemForm(items),
      address: {
        ...data.address,
        zip_code: data.address.zip_code.replace(/\D/g, ""),
      },
      client_id: selectedClient.client?.id,
    }).then(async (order) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.ORDER] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.KANBAN_ORDER] }),
      ]);
      handleClose();
      return order;
    });

    await toast.promise(promise, {
      pending: "Criando pedido...",
      success: "Pedido criado com sucesso!",
      error: "Erro ao criar pedido",
    });
  };

  const handleClientSelected = (client: Client | null) => {
    setSelectedClient({ client, addressSnapshotTaken: false });

    if (client?.address) {
      const a = client.address;
      if (a.zip_code) setValue("address.zip_code", a.zip_code);
      if (a.state) setValue("address.state", a.state);
      if (a.city) setValue("address.city", a.city);
      if (a.neighborhood) setValue("address.neighborhood", a.neighborhood);
      if (a.street) setValue("address.street", a.street);
      if (a.number) setValue("address.number", a.number);
      if (a.complement) setValue("address.complement", a.complement);
    }
  };

  const handleNameChange = (name: string) => {
    setValue("userName", name, { shouldValidate: true });
  };

  const handleCreateNewClient = (prefilledName: string) => {
    setNewClientPrefillName(prefilledName);
    setCreateClientOpen(true);
  };

  const handleClientCreated = (client: Client) => {
    handleNameChange(client.name);
    handleClientSelected(client);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-6xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader data-test="manual-order-modal">
            <DialogTitle>Novo pedido manual</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit(handleCreateOrder)();
            }}
            className="flex flex-1 flex-col min-h-0"
          >
            <div className="space-y-4 py-4">
              <Controller
                name="userName"
                control={control}
                render={({ fieldState }) => (
                  <ClientCombobox
                    value={userName}
                    onNameChange={handleNameChange}
                    onClientSelected={handleClientSelected}
                    isInvalid={Boolean(fieldState.error)}
                    errorMessage={fieldState.error?.message}
                    onCreateNew={handleCreateNewClient}
                  />
                )}
              />
              {selectedClient.client && (
                <p
                  className="text-xs text-muted-foreground -mt-2"
                  data-test="selected-client-hint"
                >
                  Cliente selecionado:{" "}
                  <strong>{selectedClient.client.name}</strong> — os dados serão
                  vinculados.
                </p>
              )}

              <div>
                <h3 className="mb-2 text-lg">Endereço de entrega</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    name="address.zip_code"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite o CEP"
                        isRequired
                        label="CEP"
                        errorMessage={fieldState.error?.message}
                        mask="cep"
                        data-test="input-cep"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="address.state"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select
                        placeholder="Selecione o estado"
                        isRequired
                        label="Estado"
                        errorMessage={fieldState.error?.message}
                        isInvalid={Boolean(fieldState.error)}
                        selectedKeys={[field.value]}
                        data-test="select-state"
                        {...field}
                      >
                        {states.map((state) => (
                          <SelectItem key={state.key} value={state.key}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name="address.city"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite a cidade"
                        isRequired
                        label="Cidade"
                        errorMessage={fieldState.error?.message}
                        data-test="input-city"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="address.neighborhood"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite o bairro"
                        isRequired
                        label="Bairro"
                        errorMessage={fieldState.error?.message}
                        data-test="input-neighborhood"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="address.street"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite a rua"
                        isRequired
                        label="Rua"
                        errorMessage={fieldState.error?.message}
                        data-test="input-street"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="address.number"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite o número"
                        isRequired
                        label="Número"
                        errorMessage={fieldState.error?.message}
                        data-test="input-number"
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    name="address.complement"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        className="w-full"
                        placeholder="Digite o complemento"
                        label="Complemento"
                        errorMessage={fieldState.error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg">Itens do pedido</h3>
                    <p className="text-sm text-muted-foreground">
                      Adicione produtos feitos por telefone, balcão ou
                      presencialmente.
                    </p>
                  </div>
                  <Button
                    text="Adicionar item"
                    type="button"
                    onClick={() => setPickingFood(true)}
                    data-test="add-item-button"
                  />
                </div>

                <div className="min-h-36">
                  {items.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {items.map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <SimpleFoodItem
                                title={item.title}
                                price={item.price}
                                description={
                                  item.observation || item.description
                                }
                                discount={item.discount}
                                image={item.image}
                                onClickAdd={() => addItemUnity(item.id)}
                                onClickRemove={() => removeItemUnity(item.id)}
                                total={item.quantity}
                                hasIncrease={false}
                              />
                            </div>
                            <Button
                              text="Remover"
                              type="button"
                              variant="ghost"
                              color="danger"
                              onClick={() => removeItem(item.id)}
                            />
                          </div>
                          {item.items.length > 0 && (
                            <div className="ml-8">
                              {item.items.map((subItem) => (
                                <SimpleFoodItem
                                  key={subItem.id}
                                  title={subItem.title}
                                  price={subItem.price}
                                  description=""
                                  image={subItem.image}
                                  total={subItem.quantity}
                                  hasChangeQuantity={false}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-36 items-center justify-center text-center text-muted-foreground">
                      Nenhum item adicionado.
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <p className="mt-3 text-right font-semibold">
                    Total: {currency(calcItemsTotal(items))}
                  </p>
                )}
              </div>

              <Controller
                name="companyObservation"
                control={control}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Observação da empresa"
                    placeholder="Digite uma observação interna ou instrução do pedido"
                    errorMessage={fieldState.error?.message}
                    data-test="input-company-observation"
                    {...field}
                  />
                )}
              />
            </div>
            <DialogFooter>
              <Button
                text="Cancelar"
                type="button"
                color="default"
                variant="ghost"
                onClick={handleClose}
                data-test="button-cancel-order"
              />
              <Button
                text="Criar pedido"
                type="submit"
                isLoading={isPending}
                isDisabled={isPending}
                data-test="button-submit-order"
              />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {pickingFood && (
        <OrderCreateItemPicker
          categories={categories || []}
          onClose={() => setPickingFood(false)}
          onSelect={handleSelectFood}
        />
      )}

      {selectedFoodId && (
        <FoodLoader
          foodId={selectedFoodId}
          onLoad={handleLoadedFood}
          onClose={() => setSelectedFoodId(undefined)}
        />
      )}

      {configuringFood && (
        <OrderCreateItemConfig
          food={configuringFood}
          onClose={() => setConfiguringFood(undefined)}
          onAdd={addItem}
        />
      )}

      <ClientFormModal
        isOpen={createClientOpen}
        prefillName={newClientPrefillName}
        onClose={() => setCreateClientOpen(false)}
        onCreated={handleClientCreated}
      />
    </>
  );
}

function FoodLoader({ foodId, onLoad, onClose }: FoodLoaderProps) {
  const { data: food } = useFood(foodId);

  useEffect(() => {
    if (food) {
      onLoad(food);
    }
  }, [food, onLoad]);

  return (
    <Dialog open onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-sm">
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary"
            role="status"
            aria-label="Carregando produto"
          />
          <span className="text-sm text-muted-foreground">
            Carregando produto...
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const createOrderItemForm = (items: FoodOrder[]): OrderItemForm[] => {
  return items.map((item) => ({
    item_id: item.itemId,
    quantity: item.quantity,
    observation: item.observation,
    discount_id: item.discount?.id,
    items: item.items.map((sub) => ({
      item_id: sub.itemId,
      quantity: sub.quantity,
    })),
  }));
};

const calcItemsTotal = (items: FoodOrder[]) => {
  return items.reduce((acc, item) => {
    const subItemsTotal = item.items.reduce(
      (subAcc, subItem) => subAcc + subItem.price * subItem.quantity,
      0,
    );

    return acc + (item.price + subItemsTotal) * item.quantity;
  }, 0);
};
