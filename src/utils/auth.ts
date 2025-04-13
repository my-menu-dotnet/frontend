import Cookies from "js-cookie";

export function isAuthenticated() {
  const token = Cookies.get("is_authenticated");
  return token === "true";
}