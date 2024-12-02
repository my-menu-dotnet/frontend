import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    required: "Campo obrigatório",
    default: "Campo inválido",
  },
  string: {
    email: "Email inválido",
  },
});

Yup.addMethod(Yup.object, "address", function () {
  return this.shape({
    street: Yup.string().required(),
    number: Yup.string().required(),
    complement: Yup.string().optional(),
    neighborhood: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    zip_code: Yup.string().required(),
  });
});

Yup.addMethod(Yup.string, "password", function () {
  return this.test("password", "Senha inválida", (value) => {
    if (!value) return true;

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=-])(?=\S+$).{8,}$/;
    return passwordRegex.test(value);
  });
});

Yup.addMethod(Yup.string, "fullName", function () {
  return this.test("fullName", "Preencha o nome e sobrenome", (value) => {
    if (!value) return true;

    const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    return fullNameRegex.test(value);
  });
});

Yup.addMethod(Yup.string, "cpf", function () {
  return this.test("cpf", "CPF inválido", (value) => {
    if (!value) return true;

    const cpf = value.replace(/\D/g, "");
    if (cpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  });
});

export default Yup;
