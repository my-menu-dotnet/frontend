import { http, HttpResponse, delay } from "msw";
import { factory } from "../factories";

const API_URL = "https://api.my-menu.net";

export const errorHandlers = [
  http.get(`${API_URL}/menu/error`, async () => {
    await delay(10);
    return HttpResponse.json({ message: "Internal server error" }, { status: 500 });
  }),

  http.get(`${API_URL}/menu/timeout`, async () => {
    await delay(60_000);
    return HttpResponse.json(factory.menu());
  }),

  http.get(`${API_URL}/menu/empty`, async () => {
    await delay(10);
    return HttpResponse.json(factory.emptyMenu());
  }),

  http.post(`${API_URL}/v1/auth/invalid`, async () => {
    await delay(10);
    return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }),

  http.post(`${API_URL}/order/fail`, async () => {
    await delay(10);
    return HttpResponse.json({ message: "Could not create order" }, { status: 422 });
  }),

  http.get(`${API_URL}/food/unauthorized`, async () => {
    await delay(10);
    return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),
];
