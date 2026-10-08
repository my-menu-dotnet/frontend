import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import ClientCombobox from "./ClientCombobox";
import { Client } from "@/types/api/Client";

// Mock the useSearchClients hook
vi.mock("@/hooks/queries/client/useSearchClients", () => ({
  default: vi.fn(),
}));

import useSearchClients from "@/hooks/queries/client/useSearchClients";

const mockClient1: Client = {
  id: "cli-1",
  name: "João Silva",
  email: "joao@example.com",
  phone: "11999999999",
  cpf: "12345678900",
  address: {
    id: "addr-1",
    street: "Rua das Flores",
    number: "123",
    complement: "Apto 45",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zip_code: "01310100",
  },
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockClient2: Client = {
  id: "cli-2",
  name: "Maria Santos",
  email: "maria@example.com",
  phone: "11888888888",
  cpf: "98765432100",
  address: {
    id: "addr-2",
    street: "Avenida Paulista",
    number: "1000",
    complement: "",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zip_code: "01311000",
  },
  created_at: "2024-01-02T00:00:00Z",
  updated_at: "2024-01-02T00:00:00Z",
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderCombobox = (
  props: Partial<{
    value: string;
    onNameChange: (name: string) => void;
    onClientSelected: (client: Client | null) => void;
    onCreateNew: (prefilledName: string) => void;
    isInvalid: boolean;
    errorMessage: string;
  }> = {}
) => {
  const defaultProps = {
    value: "",
    onNameChange: vi.fn(),
    onClientSelected: vi.fn(),
    onCreateNew: vi.fn(),
    isInvalid: false,
    errorMessage: undefined,
    ...props,
  };

  return render(<ClientCombobox {...defaultProps} />, { wrapper: createWrapper() });
};

describe("ClientCombobox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [],
      isFetching: false,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("S1: Select existing client from search results", () => {
    it("should call onClientSelected with full Client object when clicking a suggestion", async () => {
      const onClientSelected = vi.fn();
      const onNameChange = vi.fn();

      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [mockClient1, mockClient2],
        isFetching: false,
      });

      renderCombobox({ onNameChange, onClientSelected });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      await userEvent.type(input, "jo");

      await waitFor(() => {
        expect(useSearchClients).toHaveBeenCalledWith("jo");
      });

      const suggestion = screen.getByTestId("client-suggestion-cli-1");
      await userEvent.click(suggestion);

      expect(onClientSelected).toHaveBeenCalledWith(mockClient1);
      expect(onNameChange).toHaveBeenCalledWith("João Silva");
      expect(input).toHaveValue("João Silva");
    });

    it("should close the combobox after selecting a client", async () => {
      const onClientSelected = vi.fn();

      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [mockClient1],
        isFetching: false,
      });

      renderCombobox({ onClientSelected });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      await userEvent.type(input, "jo");
      await waitFor(() => expect(useSearchClients).toHaveBeenCalledWith("jo"));

      const suggestion = screen.getByTestId("client-suggestion-cli-1");
      await userEvent.click(suggestion);

      await waitFor(() => {
        expect(screen.queryByTestId("client-suggestion-cli-1")).not.toBeInTheDocument();
      });
    });
  });

  describe("S2: Create new client button", () => {
    it("should call onCreateNew with trimmed input value and keep input value", async () => {
      const onCreateNew = vi.fn();
      const onNameChange = vi.fn();

      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: false,
      });

      renderCombobox({ onCreateNew, onNameChange });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      await userEvent.type(input, "Maria");

      const createButton = screen.getByTestId("client-combobox-create-new");
      await userEvent.click(createButton);

      expect(onCreateNew).toHaveBeenCalledWith("Maria");
      expect(input).toHaveValue("Maria");
      expect(onNameChange).not.toHaveBeenCalled();
    });

    it("should show create new button only when query length >= 2 and onCreateNew provided", async () => {
      const onCreateNew = vi.fn();

      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: false,
      });

      renderCombobox({ onCreateNew });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");

      await userEvent.type(input, "M");
      expect(screen.queryByTestId("client-combobox-create-new")).not.toBeInTheDocument();

      await userEvent.type(input, "a");
      await waitFor(() => {
        expect(screen.getByTestId("client-combobox-create-new")).toBeInTheDocument();
      });
    });

    it("should not show create new button when onCreateNew is not provided", () => {
      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: false,
      });

      renderCombobox({ onCreateNew: undefined });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      fireEvent.change(input, { target: { value: "Maria" } });

      expect(screen.queryByTestId("client-combobox-create-new")).not.toBeInTheDocument();
    });
  });

  describe("S3: Popover width matches input width", () => {
    it("should render combobox content with anchor width matching input", () => {
      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [mockClient1],
        isFetching: false,
      });

      renderCombobox({});

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      fireEvent.focus(input);

      const comboboxContent = screen.getByTestId("client-combobox-content");
      expect(comboboxContent).toHaveStyle({ width: "var(--anchor-width)" });
    });
  });

  describe("Additional: Input value synchronization", () => {
    it("should sync internal input with external value prop changes", () => {
      const { rerender } = renderCombobox({ value: "Initial" });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      expect(input).toHaveValue("Initial");

      rerender(<ClientCombobox value="Updated" onNameChange={vi.fn()} onClientSelected={vi.fn()} />);

      expect(input).toHaveValue("Updated");
    });

    it("should clear selected client when user types different name after selection", async () => {
      const onClientSelected = vi.fn();
      const onNameChange = vi.fn();

      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [mockClient1],
        isFetching: false,
      });

      renderCombobox({ onClientSelected, onNameChange });

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      await userEvent.type(input, "jo");
      await waitFor(() => expect(useSearchClients).toHaveBeenCalledWith("jo"));

      const suggestion = screen.getByTestId("client-suggestion-cli-1");
      await userEvent.click(suggestion);

      await userEvent.clear(input);
      await userEvent.type(input, "Different name");

      expect(onClientSelected).toHaveBeenLastCalledWith(null);
    });
  });

  describe("Loading and empty states", () => {
    it("should show loading indicator while fetching", () => {
      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: true,
      });

      renderCombobox({});

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      fireEvent.change(input, { target: { value: "jo" } });

      expect(screen.getByTestId("client-combobox-loading")).toBeInTheDocument();
      expect(screen.getByText("Buscando clientes...")).toBeInTheDocument();
    });

    it("should show empty message when no results and query >= 2 chars", () => {
      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: false,
      });

      renderCombobox({});

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      fireEvent.change(input, { target: { value: "jo" } });

      expect(screen.getByTestId("client-combobox-empty")).toBeInTheDocument();
      expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
    });

    it("should show hint when query < 2 chars", () => {
      (useSearchClients as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        data: [],
        isFetching: false,
      });

      renderCombobox({});

      const input = screen.getByPlaceholderText("Digite o nome do cliente");
      fireEvent.change(input, { target: { value: "j" } });

      expect(screen.getByTestId("client-combobox-empty")).toBeInTheDocument();
      expect(screen.getByText("Digite ao menos 2 caracteres para buscar")).toBeInTheDocument();
    });
  });
});