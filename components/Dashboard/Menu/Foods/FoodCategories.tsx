import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Control, Controller } from "react-hook-form";
import { FoodModalForm } from "./FoodModal";

type FoodCategoriesProps = {
  control: Control<FoodModalForm, unknown>;
};

const CATEGORIES: Array<{ key: keyof FoodModalForm; label: string; test: string }> = [
  { key: "lactose_free", label: "Sem lactose", test: "checkbox-lactose-free" },
  { key: "gluten_free", label: "Sem glúten", test: "checkbox-gluten-free" },
  { key: "vegan", label: "Vegano", test: "checkbox-vegan" },
  { key: "vegetarian", label: "Vegetariano", test: "checkbox-vegetarian" },
  { key: "halal", label: "Halal", test: "checkbox-halal" },
];

export default function FoodCategories({ control }: FoodCategoriesProps) {
  return (
    <FieldGroup className="gap-3">
      <FieldLabel className="text-sm font-medium text-muted-foreground">
        Categorias alimentares
      </FieldLabel>
      <Field orientation="horizontal" className="flex-wrap gap-x-6 gap-y-3">
        {CATEGORIES.map(({ key, label, test }) => (
          <Controller
            key={key}
            name={key as keyof FoodModalForm}
            control={control}
            render={({ field }) => (
              <Field
                orientation="horizontal"
                className="gap-2"
                data-test={test}
              >
                <Checkbox
                  id={`food-${String(key)}`}
                  checked={Boolean(field.value)}
                  onCheckedChange={(v) => field.onChange(v === true)}
                />
                <FieldLabel
                  htmlFor={`food-${String(key)}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {label}
                </FieldLabel>
              </Field>
            )}
          />
        ))}
      </Field>
    </FieldGroup>
  );
}
