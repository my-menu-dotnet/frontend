import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/_ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@/components/Modal";
import Input from "@/components/form/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "@/components/form/Form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/_ui/accordion";
import useCategories from "@/hooks/queries/category/useCategories";
import { FaPlus } from "react-icons/fa";

const orderCreateSchema = z.object({
  userName: z.string().min(1, "Nome do cliente é obrigatório"),
  companyObservation: z.string().optional(),
  orderItems: z.array(
    z.object({
      productId: z.string().min(1, "Produto é obrigatório"),
      quantity: z.number().min(1, "Quantidade é obrigatória"),
    })
  ),
  address: z.object({
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    street: z.string().min(1, "Rua é obrigatória"),
    number: z.string().min(1, "Número é obrigatório"),
  }),
});

type OrderCreateForm = z.infer<typeof orderCreateSchema>;

export default function OrderCreate() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useCategories({
    sort: "order",
  });

  const form = useForm<OrderCreateForm>({
    resolver: zodResolver(orderCreateSchema),
  });

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleOpen} className="rounded-full w-12 h-12">
          <FaPlus size={2} />
        </Button>
      </div>

      <Modal open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <ModalContent className="sm:max-w-4xl">
          <ModalHeader>
            <h1>Novo Pedido</h1>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={() => {}} {...form}>
              <Form.Field
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Nome do cliente"
                    placeholder="Digite o nome do cliente"
                  />
                )}
              />
              <Form.Field
                control={form.control}
                name="companyObservation"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Observação da empresa"
                    placeholder="Digite uma observação"
                  />
                )}
              />
              <Form.Field
                control={form.control}
                name="address.neighborhood"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Bairro"
                    placeholder="Digite o bairro"
                  />
                )}
              />
              <Form.Field
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <Input {...field} label="Rua" placeholder="Digite a rua" />
                )}
              />
              <Form.Field
                control={form.control}
                name="address.number"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Número"
                    placeholder="Digite o número"
                  />
                )}
              />
              <Accordion type="single" collapsible className="w-full">
                {data?.content.map((category) => (
                  <AccordionItem value={category.id} key={category.id}>
                    <AccordionTrigger>{category.name}</AccordionTrigger>
                    <AccordionContent>
                      {/* {category.foods.map((food) => (
                        <Form.Field
                          key={food.id}
                          control={form.control}
                          name={`orderItems.${food.id}`}
                          render={({ field }) => (
                            <Input
                              {...field}
                              label={food.name}
                              placeholder="Digite a quantidade"
                              type="number"
                            />
                          )}
                        />
                      ))} */}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="flex justify-end">
                <Button type="submit">Criar Pedido</Button>
              </div>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
