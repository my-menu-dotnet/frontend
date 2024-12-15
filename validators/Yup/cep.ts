import * as Yup from "yup";

Yup.addMethod(Yup.string, "cep", function () {
  return this.test("cep", "CEP inválido", (value) => {
    if (!value) return true;

    const cep = value.replace(/\D/g, "");
    if (cep.length !== 8) return false;

    return true;
  });
});
