import * as Yup from "yup";

Yup.addMethod(Yup.object, "address", function () {
  return this.shape({
    street: Yup.string().required(),
    number: Yup.string().required(),
    complement: Yup.string().optional(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip_code: Yup.string().cep().required(),
  });
});

export function addressValidation() {
  
}