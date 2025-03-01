import * as Yup from "yup";

Yup.addMethod(Yup.string, "fullName", function () {
  return this.test("fullName", "Preencha o nome e sobrenome", (value) => {
    if (!value) return true;

    const names = value.split(" ");
    return names.length >= 2;
  });
});
