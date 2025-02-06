import Checkbox from "@/components/Checkbox";
import { Control, Controller } from "react-hook-form";
import { FoodModalForm } from "../FoodForm";

type FoodCategoriesProps = {
  control: Control<FoodModalForm, unknown>;
};

export default function SelectCategories({ control }: FoodCategoriesProps) {
  const checkbox = {
    lactose_free: "Sem lactose",
    gluten_free: "Sem glúten",
    vegan: "Vegano",
    vegetarian: "Vegetariano",
    halal: "Halal",
  } as { [key in keyof FoodModalForm]: string };

  return (
    <div className="mb-4">
      <p className="mb-4 mt-2 font-semibold text-gray-400">Categorias</p>
      <div>
        {Object.entries(checkbox).map(([key, value]) => (
          <Controller
            key={key}
            name={key as keyof FoodModalForm}
            control={control}
            render={({ field }) => (
              <Checkbox {...field} className="mr-4">
                {value}
              </Checkbox>
            )}
          />
        ))}
      </div>
    </div>
  );
}
