import { FieldValues, FormProvider, FormProviderProps, SubmitHandler } from "react-hook-form";
import { FormField } from "../_ui/form";


type FormProps<TFieldValues extends FieldValues = FieldValues> = 
  Omit<FormProviderProps<TFieldValues>, 'onSubmit'> & {
  onSubmit: SubmitHandler<TFieldValues>;
};

function Form<TFieldValues extends FieldValues = FieldValues>({ 
  onSubmit,
  ...rest 
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...rest}>
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          rest.handleSubmit?.(onSubmit)(e);
        }}
      >{rest.children}</form>
    </FormProvider>
  );
}

Form.Field = FormField;
Form.displayName = "Form";

export default Form;