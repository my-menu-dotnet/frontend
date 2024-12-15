import * as Yup from "yup";
import "@/validators/Yup/address";
import "@/validators/Yup/password";
import "@/validators/Yup/fullName";
import "@/validators/Yup/cpf";
import "@/validators/Yup/cep";
import "@/validators/Yup/state";
import "@/validators/Yup/phone";

Yup.setLocale({
  mixed: {
    required: "Campo obrigatório",
    default: "Campo inválido",
  },
  string: {
    email: "Email inválido",
  },
});

export default Yup;
