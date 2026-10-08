import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import StatusToggle from "./StatusToggle";

const renderToggle = (
  props: Partial<React.ComponentProps<typeof StatusToggle>> = {}
) => render(<StatusToggle value="ACTIVE" onChange={vi.fn()} {...props} />);

describe("StatusToggle", () => {
  it("renders both options with default labels", () => {
    renderToggle();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Inativo")).toBeInTheDocument();
  });

  it("renders default 'Status' label", () => {
    renderToggle();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders custom label when provided", () => {
    renderToggle({ label: "Disponibilidade" });
    expect(screen.getByText("Disponibilidade")).toBeInTheDocument();
  });

  it("hides the label when hideLabels=true", () => {
    renderToggle({ hideLabels: true });
    expect(screen.queryByText("Status")).toBeNull();
  });

  it("marks ACTIVE as selected when value='ACTIVE'", () => {
    renderToggle({ value: "ACTIVE" });
    const active = document.body.querySelector('[data-test="status-active"]');
    const inactive = document.body.querySelector('[data-test="status-inactive"]');
    expect(active!.getAttribute("data-state")).toBe("on");
    expect(inactive!.getAttribute("data-state")).toBe("off");
  });

  it("marks INACTIVE as selected when value='INACTIVE'", () => {
    renderToggle({ value: "INACTIVE" });
    const active = document.body.querySelector('[data-test="status-active"]');
    const inactive = document.body.querySelector('[data-test="status-inactive"]');
    expect(active!.getAttribute("data-state")).toBe("off");
    expect(inactive!.getAttribute("data-state")).toBe("on");
  });

  it("calls onChange with 'INACTIVE' when clicking the Inativo button", () => {
    const onChange = vi.fn();
    renderToggle({ value: "ACTIVE", onChange });
    const inactive = document.body.querySelector('[data-test="status-inactive"]') as HTMLElement;
    fireEvent.click(inactive);
    expect(onChange).toHaveBeenCalledWith("INACTIVE");
  });

  it("calls onChange with 'ACTIVE' when clicking the Ativo button", () => {
    const onChange = vi.fn();
    renderToggle({ value: "INACTIVE", onChange });
    const active = document.body.querySelector('[data-test="status-active"]') as HTMLElement;
    fireEvent.click(active);
    expect(onChange).toHaveBeenCalledWith("ACTIVE");
  });

  it("does not call onChange when clicking the already-selected option (ToggleGroup unselects)", () => {
    const onChange = vi.fn();
    renderToggle({ value: "ACTIVE", onChange });
    const active = document.body.querySelector('[data-test="status-active"]') as HTMLElement;
    fireEvent.click(active);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets data-disabled on the wrapper when disabled", () => {
    const { container } = renderToggle({ disabled: true });
    const wrapper = container.querySelector('[data-slot="field"]');
    expect(wrapper?.getAttribute("data-disabled")).toBe("true");
  });

  it("forwards data-test to the Field wrapper", () => {
    const { container } = renderToggle({ "data-test": "my-toggle" });
    const wrapper = container.querySelector('[data-test="my-toggle"]');
    expect(wrapper).not.toBeNull();
  });

  it("applies custom className to the wrapper", () => {
    const { container } = renderToggle({ className: "custom-class" });
    const wrapper = container.querySelector('[data-slot="field"]');
    expect(wrapper?.className).toContain("custom-class");
  });
});
