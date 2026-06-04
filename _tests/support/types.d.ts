type ManualOrderInput = {
  customerName: string;
  foodName: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  companyObservation?: string;
};

namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;

    createCategory(name?: string): void;
    removeCategory(name?: string): void;

    createFood(name: string, description: string, price: string, categoryName: string): void;

    createManualOrder(order: ManualOrderInput): void;

    selectItem(select: string, item: string): void;
    imagePicker(fixtureName: string): void;
  }
}