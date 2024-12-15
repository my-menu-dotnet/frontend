import * as Yup from "yup";

Yup.addMethod(Yup.string, "phone", function () {
  return this.test("phone", "Telefone inválido", (value) => {
    if (!value) return true;

    const phone = value.replace(/\D/g, "");
    if (phone.length < 10 || phone.length > 11) return false;

    return true;
  });
});
