import { masks } from "@/utils/masks";
import { Input as UiInput } from "@/components/_ui/input";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../_ui/form";

type InputProps = React.ComponentProps<"input"> & {
  mask?: "cpf" | "cep" | "phone";
  label?: string;
  description?: string;
};

export default function Input({
  value = "",
  mask,
  onChange,
  label,
  description,
  ...rest
}: InputProps) {
  const hanldeMask = (value: string) => {
    if (mask) {
      return masks[mask](value);
    }
    return value;
  };

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newEvent = {
      ...event,
      target: {
        ...event.target,
        value: hanldeMask(event.target.value),
      },
    };
    onChange?.(newEvent);
  }

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <UiInput value={value} onChange={handleChange} {...rest} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
