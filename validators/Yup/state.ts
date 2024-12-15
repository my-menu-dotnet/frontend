import * as Yup from "yup";
import { states } from "@/utils/lists";

Yup.addMethod(Yup.string, "state", function () {
  return this.test("state", "Estado inválido", (value) => {
    if (!value) return true;
    const statesKeys = states.map((state) => state.key);
    return statesKeys.includes(value);
  });
});
