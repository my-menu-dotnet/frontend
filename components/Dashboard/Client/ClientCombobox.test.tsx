import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { delay, http, HttpResponse } from "msw";
import { server } from "@/src/test/msw/server";
import api from "@/services/api";
import type { Client } from "@/types/api/Client";
import ClientCombobox from "./ClientCombobox";

const client: Client = {
  id: "cli-1", name: "João Silva", phone: "11999999999", email: "joao@example.com",
  cpf: "12345678900", created_at: "2024-01-01", updated_at: "2024-01-01",
  address: { id: "addr-1", street: "Rua das Flores", number: "123", complement: "",
    neighborhood: "Centro", city: "São Paulo", state: "SP", zip_code: "01310100" },
};
const searchUrl = "https://api.my-menu.net/client/search";
const previousAdapter = api.defaults.adapter;
beforeEach(() => { api.defaults.adapter = "fetch"; });
afterEach(() => { api.defaults.adapter = previousAdapter; });

function setup(options: { value?: string; onCreateNew?: (name: string) => void } = {}) {
  const selected = vi.fn();
  function Form() {
    const [name, setName] = useState(options.value ?? "");
    return <ClientCombobox value={name} onNameChange={setName}
      onClientSelected={selected} onCreateNew={options.onCreateNew} />;
  }
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  render(<QueryClientProvider client={queryClient}><Form /></QueryClientProvider>);
  return { user: userEvent.setup(), input: screen.getByRole("combobox", { name: "Nome do cliente" }), selected };
}

describe("ClientCombobox", () => {
  it("searches and delivers the selected client to the order form", async () => {
    const searches: string[] = [];
    server.use(http.get(searchUrl, ({ request }) => {
      searches.push(new URL(request.url).searchParams.get("name") ?? "");
      return HttpResponse.json([client]);
    }));
    const { user, input, selected } = setup();
    await user.type(input, "Jo");
    await user.click(await screen.findByRole("option", { name: /João Silva/ }));
    expect(searches).toEqual(["Jo"]);
    expect(selected).toHaveBeenCalledWith(client);
    expect(input).toHaveValue("João Silva");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    await user.type(input, "x");
    expect(selected).toHaveBeenLastCalledWith(null);
    expect(input).toHaveValue("João Silvax");
  });

  it("creates a client with the trimmed typed name and closes suggestions", async () => {
    server.use(http.get(searchUrl, () => HttpResponse.json([])));
    const create = vi.fn();
    const { user, input } = setup({ onCreateNew: create });
    await user.type(input, "  Ana Nova  ");
    await user.click(await screen.findByRole("button", { name: /Cadastrar.*Ana Nova/ }));
    expect(create).toHaveBeenCalledExactlyOnceWith("Ana Nova");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps a freely typed name when the input loses focus", async () => {
    server.use(http.get(searchUrl, () => HttpResponse.json([])));
    const { user, input } = setup();
    await user.type(input, "Ana");
    await screen.findByText("Nenhum cliente encontrado");
    await user.tab();
    expect(input).toHaveValue("Ana");
    expect(screen.queryByRole("button", { name: /Cadastrar/ })).not.toBeInTheDocument();
  });

  it("shows loading until the search finishes, then the empty result", async () => {
    server.use(http.get(searchUrl, async () => {
      await delay(400);
      return HttpResponse.json([]);
    }));
    const { user, input } = setup();
    await user.type(input, "An");
    expect(await screen.findByText("Buscando clientes...")).toBeInTheDocument();
    expect(screen.queryByText("Nenhum cliente encontrado")).not.toBeInTheDocument();
    expect(await screen.findByText("Nenhum cliente encontrado")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Buscando clientes...")).not.toBeInTheDocument());
  });

  it("does not search or offer creation for a one-character name", async () => {
    const requests = vi.fn();
    server.use(http.get(searchUrl, () => { requests(); return HttpResponse.json([]); }));
    const { user, input } = setup({ onCreateNew: vi.fn() });
    await user.type(input, "A");
    expect(await screen.findByText("Digite ao menos 2 caracteres para buscar")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Cadastrar/ })).not.toBeInTheDocument();
    expect(requests).not.toHaveBeenCalled();
  });
});
