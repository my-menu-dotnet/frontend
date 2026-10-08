import { AddressRequest } from "@/types/api/Address";
import * as Yup from "yup";

const CEP_REGEX = /^\d{5}-?\d{3}$/;

export const addressValidation = (): Yup.ObjectSchema<AddressRequest> =>
  Yup.object().shape({
    street: Yup.string().required(),
    number: Yup.string().required(),
    complement: Yup.string().optional(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip_code: Yup.string()
      .required()
      .matches(CEP_REGEX, "CEP inválido"),
  });
