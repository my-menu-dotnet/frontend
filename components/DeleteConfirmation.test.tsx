import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DeleteConfirmation from "./DeleteConfirmation";

const renderDialog = (props: Partial<React.ComponentProps<typeof DeleteConfirmation>> = {}) =>
  render(
    <DeleteConfirmation
      isOpen={true}
      onConfirm={vi.fn()}
      onClose={vi.fn()}
      {...props}
    />
  );

describe("DeleteConfirmation", () => {
  it("does not render content when closed (isOpen=false)", () => {
    renderDialog({ isOpen: false });
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("renders content when isOpen=true", () => {
    renderDialog({ isOpen: true });
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("uses `open` as alias when `isOpen` is not provided", () => {
    renderDialog({ isOpen: undefined, open: true } as any);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("prefers `isOpen` over `open` when both are provided", () => {
    renderDialog({ isOpen: false, open: true } as any);
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });

  it("uses 'Enviar' as default confirm button text", () => {
    renderDialog();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  it("uses 'Cancelar' as default cancel button text", () => {
    renderDialog();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("uses custom confirmText when provided", () => {
    renderDialog({ confirmText: "Deletar" });
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });

  it("uses custom cancelText when provided", () => {
    renderDialog({ cancelText: "Voltar" });
    expect(screen.getByText("Voltar")).toBeInTheDocument();
  });

  it("renders header content in the title", () => {
    renderDialog({ header: "Confirmar exclusão" });
    expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
  });

  it("renders body content in the description", () => {
    renderDialog({ body: "Esta ação não pode ser desfeita" });
    expect(screen.getByText("Esta ação não pode ser desfeita")).toBeInTheDocument();
  });

  it("does not render header when not provided", () => {
    renderDialog();
    expect(screen.queryByText("Confirmar exclusão")).toBeNull();
  });

  it("does not render body when not provided", () => {
    renderDialog();
    expect(screen.queryByText("Esta ação não pode ser desfeita")).toBeNull();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    renderDialog({ onConfirm });
    fireEvent.click(screen.getByText("Enviar"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button is clicked (triggered by both Button onClick and dialog close handler)", () => {
    const onClose = vi.fn();
    renderDialog({ onClose });
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onOpenChange(false) when closing", () => {
    const onOpenChange = vi.fn();
    const onClose = vi.fn();
    renderDialog({ onOpenChange, onClose });
    const dialog = screen.getByRole("alertdialog");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(onClose).toHaveBeenCalled();
  });

  it("data-test attribute is on the confirm button (Radix portals to body)", () => {
    renderDialog();
    const confirm = document.body.querySelector(
      '[data-test="button-modal-delete"]'
    );
    expect(confirm).not.toBeNull();
    expect(confirm!.textContent).toContain("Enviar");
  });
});
