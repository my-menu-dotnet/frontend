namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    
    createCategory(name?: string): void;
    removeCategory(name?: string): void;
    
    createFood(name: string, description: string, price: string, categoryName: string): void;

    selectItem(select: string, item: string): void;
    imagePicker(fixtureName: string): void;
  }
}