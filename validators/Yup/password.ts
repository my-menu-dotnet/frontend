import * as Yup from "yup";

Yup.addMethod(Yup.string, "password", function () {
  return this.test("password", "Senha inválida", (value) => {
    if (!value) return true;

    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=-])(?=\S+$).{8,}$/;
    return passwordRegex.test(value);
  });
});
